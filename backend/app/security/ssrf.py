import ipaddress
import socket
from urllib.parse import urlparse

# Private and loopback network definitions
BLOCKED_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

def is_safe_url(url: str) -> bool:
    """
    Validate that a URL is safe to retrieve:
    - Scheme must be http or https
    - Hostname must resolve to a public non-loopback, non-private IP
    """
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False
        
        hostname = parsed.hostname
        if not hostname:
            return False
            
        # Check forbidden hostnames
        if hostname.lower() in ("localhost", "127.0.0.1", "0.0.0.0", "::1", "metadata.google.internal"):
            return False

        # Resolve IP addresses
        ip_addresses = socket.getaddrinfo(hostname, None)
        for family, _, _, _, sockaddr in ip_addresses:
            ip_str = sockaddr[0]
            ip_obj = ipaddress.ip_address(ip_str)
            for network in BLOCKED_NETWORKS:
                if ip_obj in network:
                    return False
        return True
    except Exception:
        return False

def normalize_url(url: str) -> str:
    """Normalize URL by stripping fragments and trailing path slashes."""
    try:
        parsed = urlparse(url)
        path = parsed.path.rstrip("/")
        normalized = f"{parsed.scheme}://{parsed.netloc}{path}"
        if parsed.query:
            normalized += f"?{parsed.query}"
        return normalized
    except Exception:
        return url
