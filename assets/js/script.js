var students = []
var currentSection = 1
var url = "https://docs.google.com/forms/d/e/1FAIpQLSdXA_9eg4wk2w6AY5-vemegllklhpD86eDiskFQe4IIUb2YYg/formResponse"
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
})

addError = (id) => { $("small.help[for=" + id + "]").addClass("error") }
removeError = (id) => { $("small.help[for=" + id + "]").removeClass("error") }

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

submit = () => {
  let post_data = { }
  for (var field in fields) {
    post_data[fields[field]] = $("input[name=" + field + "]").val()
  }
  $.post({
    url: url,
    data: post_data,
    done: () => {
      goToSection(6)
    }
  })
}