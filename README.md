# laundryshop-ideas
The main purpose of this repo is to store my mockups and experiments for the shop project. After the project reaches certain maturity and functionality. I'll give the project a name (and maybe create another repo).

This project is nothing to write home about. This is just another POS software I'm writing in my free time for a friend, in order to replace the almost 15 year old one she's still running in her business. There are some special requirements for this project:

* Use modern, open technologies to build it (so that it's easy to keep updated, even if I myself don't maintain it anymore).
* Clean, easy to use interface.
* Keep the same keyboard shortcuts and (kind of) similar screen layout, so that the workflow of her business is not interrupted.

I was originally planning to build it using .NET Core, but in order to speed up development a little bit (as well as and planning ahead), I decided to use:

* Electron. Using electron-forge.
* Bootstrap, for the UI.
* And SQLite, to keep the information she needs.
