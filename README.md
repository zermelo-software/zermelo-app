Zermelo App - Open Source Edition
=================================

The Zermelo App allows students, teachers and parents to view schedules and announcements from their Zermelo Portal.
The goal is to make information from the Zermelo Portal/API easily accessible on mobile phones. Tablet support is not a 
high priority as tablets are expected to access the Zermelo Portal directly.

Please note that Zermelo and the Zermelo logo are trademarks of Zermelo Software B.V. You are not allowed to claim that your version of the app is in any way the official one. Note that this does not constitute an extra
license term for the MIT license below, it's just a part of trademark law. This is also why we've made this version of the app blue.
You can compare this to the Chromium project that is released by Google as the Chrome browser.

Improvements to the Open Source Edition of the Zermelo app will be published to the app stores as the official Zermelo App.
The only modifications on our side are to change the color to "Zermelo red".
The Zermelo App has about 100.000 installs right now. If you want to share your improvements with all these people please submit a pull request.
If you find bugs, feel free to add issues on Github.

For documentation on how to use the Zermelo API please take a look at http://developers.zermelo.nl

Building
========

The App currently supports Android, iOS and Windows Phone.

Running as WebApp
-----------------

If you want to run the app locally as webapp, you should use a browser that allows requests to file:// URLs. You can start chrome as
"chrome --allow-file-access-from-files". You also need to skip the "phonegap.js" include, so use index-web.html instead of index.html.

Building using Adobe PhoneGap
-----------------------------

The easiest way to build the app both for Android and iOS is using [PhoneGap Build](https://build.phonegap.com). You should create an account
and add signing keys for the platforms you are interested in. You can manually create a zip file for PhoneGap Build by zipping the contents of the www directory.

Building using Apache Cordova
-----------------------------

You can also use Apache Cordova to build the app:

````bash
zermelo-app$ cordova platform add android@4.0.0

zermelo-app$ cordova build
````

Building for Window Phone
-------------------------

Building for Windows Phone using PhoneGap Build has delivered mixed results. The preferred method is to create an empty Cordova project using Visual Studio and placing the contents of the `www` (or the `www/cordova/www`, see Optimizing using Sencha CMD) folder inside the new project's `www` folder. Windows Phone builds must be based on the `winphone` branch, rather than `master`.

Optimizing using Sencha CMD
---------------------------

Creating a zip of the entire www/ folder creates a bloated app. The code is not minified, and unused parts of the Sencha Touch framework are packaged into the app. To create an optimized version we use [Sencha CMD](https://www.sencha.com/products/extjs/cmd-download/).

To create an optimized version of the app:

````bash
zermelo-app$ sencha app prepare native
````

This will place a minified and trimmed version of the app in `www/cordova/www`. Uploading this version to PhoneGap Build will yield a smaller, faster app.

Architecture
============

The app is based on Sencha Touch. The starting point for the app is www/index.html. Then www/app.js is loaded, and this shows the www/app/view/Main.js view.
This view checks if the app has been linked to the portal, and if not it shows the www/app/view/Login.js view. Otherwise it shows the
www/app/view/Home.js view. The Home view is the main application, and contains the menu bar and the other views.

The www/js folder contains some supporting libraries. www/js/fullcalendar.js renders the calendar view.

Note that the app was not in any way "cleaned up" before being made open source. You will undoubtedly find quite a bit of unused files and unused code.
Code quality is also not guaranteed.

License - App
=============

The code for the app is available under the MIT license. By contributing patches, or submitting pull requests you agree
to license your contributions under the MIT license. You retain all copyright on your contributions. Note that due to the components used,
the app as it is distributed here falls under the GPLv3 license.

Copyright (c) Zermelo Software B.V. and contributors

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

License - Components
====================

The app uses various (open source) libraries. The main one is Sencha Touch. Sencha Touch is included in this repository under the GPLv3
license. Note that the Apple and Microsoft app stores do not allow the GPLv3. A solution for this is to use the commercial license for
Sencha Touch. Sencha Touch is available under the commercial license for free from the Sencha Touch website.

Licenses for other components can be found in the respective directories and files.
