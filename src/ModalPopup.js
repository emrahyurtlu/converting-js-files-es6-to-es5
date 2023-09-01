class EsiModalPopup {
  constructor() {
    this.Id = "esiModal"
    this.Title = ""
    this.Text = ""
    this.Buttons = []
    this.modalElement = null
    this.Image = null
    this.ButtonsContainerId = ""
    this.Width = ""
    this.Size = ""
    this.HeaderClasses = "colored-header colored-header-primary"
    this.ShownCallback = Object
    this.CloseOnSelect = true 
    this.AllowMoving = true
    this.Animated = true
    this.Backdrop = true
  }

  createModal() {
    const modal = document.createElement("div")
    modal.id = this.Id
    modal.classList.add("modal", "fade")
    modal.tabIndex = -1
    modal.setAttribute("aria-labelledby", `${this.Id}Label`)
    modal.setAttribute("aria-hidden", "true")
    modal.setAttribute("data-bs-backdrop", "true")
    modal.setAttribute("data-bs-keyboard", "true")

    // Add buttons
    var hasDefaultButton = false
    if (this.Buttons.length > 0) {
      var footer = $("<div class='modal-footer' id=" + this.ButtonsContainerId + "></div>")
      for (var b = 0; b < this.Buttons.length; b++) {
        var but = this.Buttons[b]
        var button = $("<button type='button' class='btn' data-bs-dismiss='modal'></button>")
          .data("id", but.id)
          .data("val", but.val)
          .attr("data-shortcut", but.Shortcut || "")
          .html(but.Text)
          .addClass(but.Class || "btn-secondary")

        hasDefaultButton = hasDefaultButton || but.Shortcut == "enter"

        button.data("button", but).click(function () {
          var data = $(this).data("button")
          if (data.CallBack) {
            data.CallBack($(this))
          }
        })

        footer.append(button)
      }
      return modal;
    }

    modal.innerHTML =
      '<div class="modal-dialog ' +
      this.Size +
      '"><div class="modal-content" ' +
      `style="width:${this.Width}px;"` +
      '><div class="modal-header ' +
      this.HeaderClasses +
      '"><h3 class="modal-title" id="' +
      this.Id +
      'Label">' +
      this.Title +
      '</h3><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">' +
      this.Text +
      "</div></div></div>"

    this.modalElement = modal
    $(modal).find(".modal-content").append(footer)
    document.body.appendChild(modal)
  }

  Show() {
    if (!this.modalElement) {
      this.createModal()
    }

    //const modal = bootstrap.Modal.getOrCreateInstance("#" + this.Id)
    const modal = new bootstrap.Modal(document.getElementById(this.Id), {
      backdrop: this.Backdrop,
    })
    let self=this;
    $(this.modalElement).on('shown.bs.modal', function() { 
       if (self.ShownCallback) {
        self.ShownCallback({},$(self.modalElement),$(self.modalElement).find(".modal-body"))
      }

      //const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      // if(tooltipTriggerList&&tooltipTriggerList.length>0)
      //     tooltipTriggerList.map((item) => bootstrap.getOrCreateInstance(item).dispose())
    });

 
    modal.show()

    

    this.modalElement.addEventListener("hidden.bs.modal", () => {
      console.log("Modal closed.")
      this.Hide()
    })
  }

  Hide() {
    this.modalElement.remove()
    this.modalElement = null
  }

  static Hide() {
    const popup = new EsiModalPopup()
    popup.Hide()
  }

  static Show(config) {
    const popup = new EsiModalPopup()

    popup.Title = config.Title
    popup.Text = config.Text
    popup.Buttons = config.Buttons
    popup.Width = config.Width
    popup.ButtonsContainerId = config.ButtonsContainerId
    popup.ShownCallback=config.ShownCallback;
    if (config.Size) popup.Size = "modal-" + config.Size

    console.log("EsiModalPopup.Show(config) ", config)

    popup.Show()
  }

  static Confirm(sText, fYesFunc, fNoFunc, iWt, iHt, sTitle) {
    const confirmation = new EsiModalPopup()
    confirmation.Id = "confirmation-modal"
    confirmation.Title = sTitle != undefined ? sTitle : "Confirmation"
    confirmation.Text = "<h3>" + sText + "</h3>"
    confirmation.Image = {Src: "/Images/WarningBig.png", Alt: "Warning"}
    confirmation.Buttons = [
      {Text: "Yes", CallBack: fYesFunc, Width: "100", Shortcut: "enter", Class: "btn-danger"},
      {Text: "No", CallBack: fNoFunc, Width: "100", Shortcut: "escape", Class: "btn-default"},
    ]

    confirmation.Show()
  }
}