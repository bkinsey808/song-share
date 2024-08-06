# Warning

All files in this project marked with "use server" directive shall be located in this directory. Do NOT use "use server" directive outside this directory. These files need to be carefully audited. ALL exported functions in a file marked with "use server" are public end points. They need authentication. It's easy to make security mistakes. Tread carefully.

see [NextJS 'use server' Trap (Accidentally Leaking Data)](https://www.youtube.com/watch?v=yBEHKoaoZpY)
