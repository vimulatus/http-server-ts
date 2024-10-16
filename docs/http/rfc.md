# HTTP

The Hypertext Transfer Protocol (HTTP) is a family of stateless, application-level, request/response protocols that share a generic interface, extensible semantics, and self-descriptive messages to enable flexible interaction with network-based hypertext information systems.

HTTP hides the details of how a service is implemented by presenting a uniform interface to clients that is independent of the types of resources provided.

HTTP/1.1 was designed to refine the protocol's features while retaining compatibility with the existing text-based messaging syntax, improving its interoperability, scalability, and robustness across the Internet.
This included 
 - length-based data delimeters for both fixed and dynamic (chunked) content 
 - a consistent framework for content negotiation
 - opaque validators for conditional requests
 - cache controls for better cache consistency
 - range requests for partial updates
 - default persistent connections

 HTTP/2 introduced a multiplexed session layer on top of the existing TLS and TCP protocols for exchanging concurrent HTTP messages with efficient field compression and server push.

HTTP/3 provides greater independence for concurrent messages by using QUIC as a secure multiplexed transport over UDP instead of TCP.

All three major versions of HTTP rely on the semantics defined by this document, and have not obsoleted each other because each one has specific benefits and limitations depending on the context of use.

# Core semantics

HTTP provides a uniform interface for interacting with a resource -- regardless of its type, nature, or implementation -- by sending messages that manipulate or transfer representations.

Each message is either a request or a response:
 - A client constructs request messages that communicate its intentions and routes those messages toward an identified origin server. 
 - A server listens for requests, parses each message received, interprets the message semantics in relation to the identified target resource, and responds to that request with one or more response messages.

HTTP semantics include the intentions defined by each request method, extensions to those semantics that might be described in the request header fields, status codes that describe the response and other control data and resource metadata that might be given in response fields.

Semantics also include representation metadata that describe how content is intended to be interpreted by a recipient, request header fields that might influence content selection, and the various selection algorithms that are collectively referred to as "content negotiation"

# Requirements

## Length Requirements

At a minimum, a recipient must be able to parse and process protocol element lengths that are at least as long as the values that it generates for those same protocol elements in other messages.

# Message Format

All `HTTP/1.1` messages consist of a start-line followed by a sequence of octets in a format similar to the Internet Message Format:
 - zero or more header fields (collectively referred to as the "headers" or the "header section")
 - an empty line indicating the end of the header selection
 - an optional message body

```
    HTTP-message = start-line
                   *( header-field CRLF )
                   CRLF
                   [ message-body ]
```

The normal procedure for parsing an HTTP message is to 
1. read the start-line into a structure
2. read each header field into a hash table by field name until the empty line,
3. use the parsed data to determine if a message body is expected
4. If a message body has been indicated, then it is read as a stream until an amount of octets equal to the message body length is read or the connection is closed.

> [!WARNING]
> A recipient must parse an HTTP message as a sequence of octets in an encoding that is a superset of US-ASCII.
> Parsing an HTTP message as a stream of Unicode characters, without regard for the specific encoding, creates security vulnerabilities due to the varying ways that string processing libraries handle invalid multibyte character sequences that contain the octet LF (%x0A).
> String based parsers can only be safely used within protocol elements after the element has been extracted from the message, such as within a header field-value after message parsing has delineated the individual fields.

An HTTP message can be parsed as a stream for incremental processing or forwarding downstream.
However, recipients cannot rely on incremental delivery of partial messages, since some implementations will buffer or delay message forwarding for the sake of network efficiency, security checks, or payload transformations.

A sender must not send whitespace between the start-line and the first header field.
A recipient that receives whitespace between the start-line and the first header field must either reject the message as invalid or consume each whitespace-preceded line without further processing of it.

The presence of such whitespace in a request might be an attempt to trick a new server into ignoring that field or processing the line after it as a new request, either of which might result in a security vulnerability if other implementations within the request chain interpret the same message differently.

## Start Line

An HTTP message can be either a request from client to server or a response from server to client.

Syntactically, the two types of message differ only in the start-line, which is either a request-line (for requests) or a status-line (for responses), and in the algorithm for determining the length of the message body.

In theory, a client could receive requests and a server could receive responses, distinguishing them by their different start-line formats, but, in practice, servers are implemented to only expect a request (a response is interpreted as an unknown or invalid request method) and clients are implemented to only expect a response.

### Request Line

A request-line begins with a method token, followed by a single space (SP), the request-target, another single space(SP), the protocol version, and ends with CRLF.

```
request-line = method SP request-target SP HTTP-version CRLF
```

The [method](./request-method.md) token indicates the request method to be performed on the target resource.

The request target identifies the target resource upon which to apply the request.

Recipients typically parse the request-line into its component parts by splitting on whitespace, since no whitespace is allowed in the three components.
Unfortunately, some user agents fail to properly encode or exclude whitespace found in hypertext references, resulting in those disallowed characters being sent in a request-target.
Recipients of an invalid request-line should respond with either a `400 (Bad request)` error or a `301 (Moved Permanently)` redirect with the request-target properly encoded.
A recipient should not attempt to autocorrect and then process the request without a redirect, since the invalid request-line might be deliberately crafted to bypass security filters along the request chain.

HTTP does not place a predefined limit on the length of a request-line. 
A server that receives a method longer than any that it implements should respond with a `501 (Not Implemented)` status code.
A server that receives a request-target longer than any URI it wishes to parse must respond with a `414 (URI Too Long)` status code.

### Status Line

The first line of a response message is the status line, consisting of the protocol version, a space (SP), the status code, another space, a possibly empty textual phrase describing the status code, and ending with CRLF.
