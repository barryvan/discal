# Discal

Discal is a simple web-app which renders a calendar from an ICS URL.

Set it up on a tablet attached to your meeting room doors,
and you'll never again have arguments about who booked what and when.

![Screenshot of Discal](screenshot.png)

## Try it out

Header over to https://barryvan.github.io/discal/ to give it a 
shot! Note that, as per the note below, your ICS files will 
need to be available via CORS.

## Features

* Automatic refresh of calendar data every 60 seconds
* Configurable scale factor
* Customisable title
* Tolerant of network failures (thanks to ServiceWorker)
* Current time indicator (simple white line)
* Keeps current time centred in view

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

## Browser support

* Firefox (tested in 47)
* Chrome (tested in 51)
* Edge (tested in 25; uses a polyfill for `fetch`)

Because this is a quick hobby project, it uses some of the new and shiny, like
[the `fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API),
[fat-arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions),
and [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
-- so it requires
browsers which support these to work. (MS Edge is out at the time of writing.)

## Libraries

* The excellent [iCal.js](https://github.com/mozilla-comm/ical.js) library by Mozilla to parse
and work with `ics` files and events.
* [GitHub's Fetch polyfill](https://github.com/github/fetch) lets this work in browsers that don't yet
support the `fetch()` API.

