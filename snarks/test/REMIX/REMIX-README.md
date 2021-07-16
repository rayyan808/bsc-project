
===> Zokrates-CLI simply won't let me run tests via JSON-ABI, so I was forced to fork a seperate REMIX implementation for testing.
===> Zokrates is still in beta phase and there are different versions available according to CLI and IDE. Due to this I had to seperate the circuits according to where you choose to compile.
===> Zokrates on Remix-IDE requires field type variables in loops
===> Zokrates-CLI requires u32 type variables in loops.

This causes issues when compiling, so for clarity they have be seperated. This folder is solely for easier testing during development, and will not be present in the final pull request.

