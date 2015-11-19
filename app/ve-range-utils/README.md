This is a collection of range utility functions.

A range must be an object with a start and end property.
Eg:
```
var myRange = {
	start: 10,
	end: 40
}
```

A "circular" range has a start > end.
Eg:
```
var myRange2 = {
	start: 50,
	end: 40
}
```

All ranges are assumed to have 0-based indices:

rrrr
0123
start = 0,
end = 3


By default, errors are thrown if the inputs to a function don't comply with what the function expects. This functionality can be turned off by setting the environment variable NODE_ENV=production.


