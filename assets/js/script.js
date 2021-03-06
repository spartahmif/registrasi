var students = []
var currentSection = 1
var post_url = "https://docs.google.com/forms/d/e/1FAIpQLSdXA_9eg4wk2w6AY5-vemegllklhpD86eDiskFQe4IIUb2YYg/formResponse"
var get_url = "https://script.googleusercontent.com/macros/echo?user_content_key=q8W19WQXXhG9lo3_ZbttUORyOfLKSsLUlecZL4lRNb-aWPPW7II6PH0j0SaPj3XAXQtU0y6ZLl6eENaG8IGa7ARf_AAwJcM8OJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHazEeky60NwwGk66bQlWd0-p2fAbCvy4Rn-uapyGFGbVSkJViAmOkexqbAPk7pVNlJBanIwEBclWvC0EefjgA5A8ac8KEtK2hPmJDD_pdLovgbNVyXcE4JzHxXBEDMqRiF4fJZFdMRt_K&lib=MoDMSa-u8He-AWCSgL7s-BX9CcG857dnx"
var fields = {
  nim: "entry.1891528819",
  nama: "entry.725355731",
  jurusan: "entry.1106068168",
  email: "entry.2084411624",
  alamat: "entry.1428398795",
  notelp: "entry.1264431935",
  idline: "entry.1356309428",
  namawali: "entry.1178902800",
  hubwali: "entry.187933075",
  nowali: "entry.148348283",
  goldar: "entry.2145182059",
  penyakit: "entry.1479599575",
  dikdiv: "entry.371499753"
}
var errors = { }

$.getJSON("data/stei17.json", (data) => { students = data })

$(document).ready(() => {
  $("input[name=nim]").change(() => {
    removeError("name")

    students.forEach((student, index) => {
      if (student.nim_tpb == $("input[name=nim]").val()) {
        $("input[name=nama]").val(student.name)
      }
    })
  })
  getRegistered(showRegistered)
})

validateRadioBoxChecked = (id) => {
  let selector = "input[name=" + id + "]:checked";
  if (!$(selector).val()) {
    let errorId = parseInt($(selector + ":first").attr("sectid"))
    addError(id, errorId)
  } else {
    removeError(id)
  }
}

validateInputTextField = (id) => {
  let selector = "input[name=" + id + "]";
  let text = $(selector).val();
  let validate = $(selector).attr("validate");
  if (validateText(text, validate)) {
    removeError(id)
  } else {
    const errorId = parseInt($(selector).attr("sectid"))
    addError(id, errorId)
  }
}

validateText = (text, validate) => {
  return new RegExp(validate).test(text);
}

addError = (id, sectId) => {
  errors[id] = sectId
  $("small.help[for=" + id + "]").addClass("error")
}
removeError = (id) => {
  delete errors[id]
  $("small.help[for=" + id + "]").removeClass("error")
}

goToSection = (id) => {
  if (id > currentSection) nextSection(id)
  else if (id < currentSection) prevSection(id)
}

nextSection = (id) => {
  let curr = $("#sect" + currentSection)
  let next = $("#sect" + id)
  next.css("left", "100vw")
  curr.animate({ left: "-100vw", opacity: 0}, 500, "swing", () => {
    curr.addClass("hidden")
    next.removeClass("hidden")
    next.animate({ left: "0", opacity: 1}, 500, "swing")
    currentSection = id
  })
}

prevSection = (id) => {
  let curr = $("#sect" + currentSection)
  let next = $("#sect" + id)
  next.css("left", "-100vw")
  curr.animate({ left: "100vw", opacity: 0}, 500, "swing", () => {
    curr.addClass("hidden")
    next.removeClass("hidden")
    next.animate({ left: "0", opacity: 1}, 500, "swing")
    currentSection = id
  })
}

validateForm = () => {
  validateInputTextField("nim");
  validateInputTextField("nama");
  validateInputTextField("email");
  validateInputTextField("alamat");
  validateInputTextField("notelp");
  validateInputTextField("idline");
  validateInputTextField("namawali");
  validateInputTextField("hubwali");
  validateInputTextField("nowali");

  validateRadioBoxChecked("jurusan");
  validateRadioBoxChecked("goldar");

  return $.isEmptyObject(errors);
}

submit = () => {
  if (validateForm()) {
    let post_data = { }
    for (var field in fields) {
      if ($("textarea#" + field).length) {
        post_data[fields[field]] = $("textarea#"+field).val() 
      } else if ($("input[name=" + field + "]").attr("type") == "number") {
        post_data[fields[field]] = "'" + $("input[name=" + field + "]").val()
      } else if ($("input[name=" + field + "]").attr("type") == "radio") {
        post_data[fields[field]] = $("input[name=" + field + "]:checked").val()
      } else {
        post_data[fields[field]] = $("input[name=" + field + "]").val()
      }
    }
    $.post({
      url: post_url,
      data: post_data,
      complete: () => {
        goToSection(6)
      }
    })
  } else {
    let errorIds = Object.keys(errors);
    let lowestErrorSection = errors[errorIds[0]];

    for (const errorId in errorIds) {
      if (errors[errorId] < lowestErrorSection) {
        lowestErrorSection = errors[errorId];
      }
    }

    goToSection(lowestErrorSection);
  }
}

getRegistered = (cb) => {
  let list = $("#list")
  list.html("Loading ...")

  $.get({
    url: get_url,
    success: (data) => {
      cb(JSON.parse(data))
    },
    error: (err) => {
      list.html("Error: " + err)
    }
  })
}

showRegistered = (rows) => {
  let list = $("#list")
  list.empty()
  rows.forEach((item, index) => {
    let litem = $("<div></div>", {class: "list-item"})
    let date = new Date(item[0])
    litem.html(
      ""
      + item[1]
      + " ("
      + date.toLocaleDateString("id-ID")
      + " "
      + date.toLocaleTimeString("id-ID")
      + ")")
    list.append(litem)
  })
}