"use strict";

var KTAccountSettingsSigninMethods = {
    init: function () {
        var n = document.getElementById("kt_signin_password");
        var i = document.getElementById("kt_signin_password_edit");
        var r = document.getElementById("kt_signin_password_button");
        var a = document.getElementById("kt_password_cancel");

        var d = function () {
            if (n) n.classList.toggle("d-none");
            if (r) r.classList.toggle("d-none");
            if (i) i.classList.toggle("d-none");
        };

        if (r) {
            var rBtn = r.querySelector("button");
            if (rBtn) {
                rBtn.addEventListener("click", function () {
                    d();
                });
            }
        }

        if (a) {
            a.addEventListener("click", function () {
                d();
            });
        }
    }
};

function onDOMContentLoaded(callback) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
}

onDOMContentLoaded(function () {
    KTAccountSettingsSigninMethods.init();
});
