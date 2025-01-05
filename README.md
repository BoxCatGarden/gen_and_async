# gen_and_async
The project uses async function to emulate async generator function
and uses generator function to emulate async function and async generator function.

Both `await` and `yield` can interrupt and resume the execution of a function.
The core underlying implementation may be saving and restoring the
registers and the stack frame.

Because `await` and `yield` have the same behavious, this project tries to
implement them based on each other.

# File Structure
## /nodejs
The implementations.

## /test
Test files. Using `Run-All.ps1` to run the test.

## /test_native
The test programes giving the reference output. They are implemented with the original syntax.

