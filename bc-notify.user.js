// ==UserScript==
// @name         BCNotify
// @namespace    https://bcmc.ga/authors/tumblegamer/
// @version      0.1.0.1
// @require      https://github.com/tumble1999/mod-utils/raw/master/mod-utils.js
// @require      https://github.com/tumble1999/modial/raw/master/modial.js
// @require      https://github.com/tumble1999/critterguration/raw/master/critterguration.user.js
// @author       Tumble
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// @run-at       document-start
// ==/UserScript==

(function () {
	"use strict";

	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	if (uWindow.BCNotify)
		return;

	let deps = [
		{
			obj: "TumbleMod",
			text: "// @require      https://github.com/tumble1999/mod-utils/raw/master/mod-utils.js"
		},
		{
			obj: "Critterguration",
			text: "// @require      https://github.com/tumble1999/critterguration/raw/master/critterguration.user.js"
		}
	];
	if (deps.map(dep => eval("typeof " + dep.obj)).includes("undefined")) throw "\nATTENTION MOD DEVELOPER:\nPlease add the following to your code:\n" + deps.map(dep => {
		if (eval("typeof " + dep.obj) == "undefined") return dep.text;
	}).filter(d => !!d).join("\n");

	const BCNotify = new TumbleMod({
		id: "bcNotify", // code-friendly version of name
		abriv: "Notify", // abbreviation for mod.log
		name: "Notifications",
		author: "Tumble"
	}),
		//Setup notifications log
		notificationsLogPage = Critterguration.registerSettingsMenu(BCNotify),
		notificationList = notificationsLogPage.createListGroup("Notifications");


	async function setup() {
		if (!Notification) {
			alert("Your browser does not support notifications");
		}
		if (Notification.permission !== "granted")
			return Notification.requestPermission();
	};
	async function notify({ title, body, icon, action }) {
		await setup();
		let not = new Notification(title, {
			body,
			icon,

		});
		if (action) not.addEventListener("click", action);

		let btn = document.createElement("button"),
			listItem = notificationList.addItem(title, "secondary", body, "BCNotify", "Corner", null, action);
		listItem.cornerElm.innerText = "";
		listItem.cornerElm.appendChild(btn);
		btn.classList.add("btn-close");
		btn.addEventListener("click", () => {
			listItem.remove();
		});
	};

	function register({ name }) {
		return {
			notify: options => {
				options.footer = name;
				notify(options);
			}
		};
	}
	BCNotify.register = register;

	uWindow.BCNotify = BCNotify;
})();