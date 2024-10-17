
# Header Fields

Each header field consists of a case-insensitive field name followed by a colon (":"), optional leading whitespace, the field value, and optional trailing whitespace.
```
header-field = field-name ":" OWS field-value OWS
```

No whitespace is allowed between the header field-name and colon. 
A server must reject any received request message that contains whitespace between a header field-name and colon with a response code of `400 (Bad Request)`
A proxy must remove any such whitespace from a response message before forwarding the message downstream.

Header fields are fully extensible, ie, there is no limit on the introduction of new field names, each presumably defining new semantics, nor on the number of header fields used in a given message.

New header fields can be defined such that, when they are understood by a recipient, they might override or enhance the interpretation of previously defined header fields, define preconditions on request evaluation, or refine the meaning of responses.

A proxy must forward unrecognised header fields unless the field-name is listed in the Connection header field or the proxy is specifically configured to block, or otherwise transform, such fields.

## Field Order

The order in which header fields with differing field names are received is not significant.
However, it is good practice to send header fields that contain control data first, such as Host on requests and Date on responses, so that implementations can decide when not to handle a message as early as possible.

A server must not apply a request to the target resource until the entire request header section is received, since later header fields might include conditionals, authentication credentials, or deliberately misleading duplicate header fields that would impact request processing.

A sender must not generate multiple header fields with the same field name in a message unless either the entire field value for that header field is defined as a comma-separated list [ie, #(values)] or the header field is a well known exception.
> In practice, the "Set-Cookie" header field often appears multiple times in a response message and does not use the list syntax, violating the above requirements on multiple header fields with the same name.
> Since it cannot be combined into a single field-value, recipients ought to handle "Set-Cookie" as a special case while processing header fields.

A recipient may combine multiple header fields with the same field name into one "field-name: field-value" pair, without changing the semantics of the message, by appending each subsequent field value to the combined field value in order, separated by a comma.

The order in which header fields with the same field name are received is therefore significant to the interpretation of the combined field value; a proxy must not change the order of these field values when forwarding a message.

## Field Limits

Http does not place a predefined limit on the length of each header field or on the length of the header section as a whole.

A server that receives a request header field, or set of fields, larger than it wishes to process must respond with an appropriate 4xx (Client Error) status code.

> [!DANGER] 
> Ignoring such header fields would increase the server's vulnerability to request smuggling attacks.


