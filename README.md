# WebM as a GIF replacement

This is an experiment to replace a GIF with WebM.
I have no experience with ffmpeg, so this is me trying to make sense of the documentation.

**Why WebM?** WebM is the only container format that is open in specification (compared to AVI or MP4 for example).
WebM supports VP8 and VP9, the support for them is pretty much the same.
AV1 support is experimental, and only supported in Chrome.
So I went with VP9.

This uses the two-pass approach [as outlined by the ffmpeg documentation](https://trac.ffmpeg.org/wiki/Encode/VP9) for VP9.
