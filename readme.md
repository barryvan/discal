# Discal

Discal is a simple web-app which renders a calendar from an ICS URL.

Set it up on a tablet attached to your meeting room doors,
and you'll never again have arguments about who booked what and when.

## Basic setup

Discal must be served over HTTPS if you want it to be resilient in the face
of poor network connectivity (which you obviously do).
So put the Discal files on a server which supports HTTPS, and navigate to the
appropriate URL.

## Configuration

When first started on each device, the config window will be displayed.
(You can show it again by tapping the menu button in the top right-hand corner.)
Enter a title for this display (like "Boardroom"), the URL of an ICS file (see
note below), and optionally tweak the scale factor. The default scale, `1.5`, renders each
hour as 90 CSS pixels.

## Accessing your calendar files

Discal will make a `fetch()` request for your ICS files.
This means that they need to be on the same server, or on a server with CORS configured
to allow such requests. If you're not in this situation, then you may want to consider
setting up your webserver to proxy requests like `/boardroom.ics` to the appropriate URL.