# Method

The method token indicates the request method to be performed on the target resource.
> [!Warning] The request method is case-sensitive

The request method token is the primary source of request semantics; it indicates the purpose for which the client has made this request and what is expected by the client as a successful result.

Standard Methods:
 - GET: Transfer a current representation of the target resource
 - HEAD: Same as GET, but only transfer the status line and header section
 - POST: Perform resource-specific processing on the request payload
 - PUT: Replace all current representations of the target resource with the request payload.
 - DELETE: Remove all current representations of the target resource
 - CONNECT: Establish a tunnel to the server identified by the target resource
 - OPTIONS: Describe the communication options for the target resource
 - TRACE: Perform a message loop-back test along the path to the target resource.

The set of methods allowed by a target resource can be listed in an `Allow header` field.

When a request method is received that is unrecognised or not implemented by an origin server, the origin server should respond with the `501 (Not Implemented)` status code.

When a request method is received that is known by an origin server, but not allowed for the target resource, the origin server should respond with the `405 (Method Not Allowed)` status code.
