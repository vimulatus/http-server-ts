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
