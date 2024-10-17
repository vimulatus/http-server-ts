# Host Header

The "Host" header field in a request provides the host and port information from the target URI, enabling the origin server to distinguish among resources while servicing requests for multiple host names on a single IP address.
```
    Host = uri-host [ ":" port ]
```

A client must send a host header field in all HTTP/1.1 request messages. If the target URI includes an authority component, then a client must send a field-value for Host that is identical to that authority component, excluding any userinfo subcomponent and its "@" delimiter.

If the authority component is missing or undefined for the target URI, then a client must send a host header field with an empty field-value.

Since the Host field-value is critical information for handling a request, a user agent should generate host as the first header field following the request-line.

A client must send a host header field in an HTTP/1.1 request even if the request-target is in the absolute-form, since this allows the Host information to be forwarded through ancient HTTP/1.0 proxies that might not have implemented Host.

When a proxy receives a request with an absolute-form of request-target, the proxy must ignore the received host header field and instead replace it with the host information of the request-target.

> [!WARNING]
> Since the Host header field acts as an application-level routing mechanism, it is a frequent target for malware seeking to poison a shared cache or redirect a request to an unintended server.
> An interception proxy is particularly vulnerable if it relies on the Host field-value for redirecting requests to internal servers, or for use as a cache key in a shared cache, without first verifying that the intercepted connection is targeting a valid IP address for that host.

A server must respond with a `400 (Bad Request)` status code to any HTTP/1.1 request message that lacks a Host header field and to any request message that contains more than one Host header field or a Host header field with an invalid field-value.
