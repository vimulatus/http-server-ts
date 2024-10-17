# Request Target

The client sends an HTTP request message with a request-target derived from the target URI.

There are four distinct formats for the request-target, depending on both the method being requested and whether the request is to a proxy.

## Origin Form

The most common form of request-target is the origin form.

```
    origin-form = absolute-path [ "?" query ]
```

When making a request directly to an origin server, other than a `CONNECT` or server-wide `OPTIONS` request, a client must send only the absolute path and query components of the target URI as the request-target. 

If the target URI's path component is empty, the client muust send "/" as the path within the origin-form of request-target. 

A `HOST` header field is also sent.

For example, a client wishing to retrieve a representation of the resource identified as `http://www.example.org/where?q=now` directly from the origin server would open a TCP connection to port 80 of the host `www.example.org` and send the lines:
```
    GET /where?q=now HTTP/1.1
    HOST: www.example.org
```
followed by the remainder of the request message.

## Absolute Form

When making a request to a proxy, other than a `CONNECT` or server-wide `OPTIONS` request, a client must send the target URI in absolute form as the request target

The proxy is then requested to either service that request from a valid cache, if possible, or make the same request on the client's behalf to either the next inbound proxy server or directly to the origin server indicated by the request-target.


An example of absolute-form of request-line would be 
```
    GET http://www.example.org/pub/WWW/TheProject.html HTTP/1.1
```

To allow for transition to the absolute-form for all requests in some future version of HTTP, a server must accept the absolute-form in requests

## Authority Form

The authority-form is *only used for CONNECT requests*.

When making a CONNECT request ot establish a tunnel through one or more proxies, a client must send only the target URI's authority component (excluding any userinfo and its "@" delimiter) as the request-target.

For example,
```
    CONNECT www.example.com:80 HTTP/1.1
```

## Asterisk Form

The asterisk-form is *only used for a server-wide OPTIONS request*.

When a client wishes to request OPTIONS for the server as a whole, as opposed to a specific named resource of that server, the client must send only "*" as the request target.

For example,
```
    OPTIONS * HTTP/1.1
```

If a proxy receives an OPTIONS request with an absolute-form of request-target in which the URI has an empty path and no query component, then the last proxy on the request chain must send a request-target of "*" when it forwards the request to the indicated origin server.

For example, the request
```
    OPTIONS http://www.example.org:8001 HTTP/1.1
```
would be forwarded by the final proxy as
```
    OPTIONS * HTTP/1.1
    Host: www.example.org:8001
```
after connecting to port 8001 of host "www.example.org"
