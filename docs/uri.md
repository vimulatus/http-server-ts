# Uniform Resource Identifier

A URI is an identifier consisting of a sequence of characters matching the syntax rule. 
It enables uniform identification of resources via a separately defined extensible set of naming schemes.

URIs have a global scope and are interpreted consistently regardless of context.
However, an action made on the basis of that reference will take place in relation to the end user's context.

A URI is a sequence of characters from a very limited set:
- the letters of the basic Latin alphabet
- digits
- a few special characters

## URI, URL, and URN

A URI can be further classified as a locator, a name, or both.

The term "Uniform Resource Locator" (URL) refers to the subset of URIs that, in addition to identifying a resource, provide a means of locating the resource by describing its primary access mechanism (eg, its network location).

The term "Uniform Resource Name" (URN) refers to URIs which are globally unique and persistent even when the resource ceases to exist or becomes unavailable.

---

The URI syntax is organised hierarchically, with components listed in order of decreasing significance from left to right. 

## URI Syntax

```
    URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
    hier-part = "//" authority path-abempty
                / path-absolute
                / path-rootless
                / path-empty
```

### Scheme

Each URI begins with a scheme name that refers to a specification for assigning identifiers within that scheme.

Scheme names consist of a sequence of characters beginning with a letter and followed by any combination of letters, digits, plus ("+"), period ("."), or hyphen ("-").

Schemes are case-insensitive.

```
    scheme = ALPHA *(ALPHA / DIGIT / "+" / "-" / ".")
```

### Authority

The authority component is preceded by a double slash ("//") and is terminated by the next slash ("/"), question mark ("?"), or number sign ("#") character, or by the end of the URI.

```
    authority = [ userinfo "@" ] host [ ":" port ]
```

If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character.
