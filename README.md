# KClient

KClient is a minimalistic Khanacademy program viewer with the eventual goal of archiving all Khanacademy (just in case they get taken down).

Here is the [hosted demo](https://kclient.linolevan.com)

## How?

Currently, KClient uses the internal khanacademy API to load the hot programs. Eventually, these will all be stored in a database outside of Khanacdemy.

Technically, there are two styles of programs in Khanacademy:

- HTML
- PJS

HTML programs are quite easy to run and should be 100% compatible.

PJS programs are significantly harder to run because of Khanacademy's custom flavor. Currently, we are using an in-house built [kdraw](https://github.com/lino-levan/kdraw.js) which has a significant amount of well known issues.
