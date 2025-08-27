$(document).ready(function () {
  $('#signOutBtn').on('click', () => {
    $('#signout').submit()
    window.location = '/admin'
  })

  $('.chosen').chosen({
    disable_search_threshold: 10,
    width: '100%'
  })

  $('.form').validate()

  $('#newColor').on('click', (e) => {
    var parent = document.querySelector('.color')
    var field = document.createElement('input')
    var div = document.createElement('div')
    var i = document.createElement('i')
    i.className = 'bi bi-x remove'
    i.style = 'color:red;'
    div.className = 'd-flex align-items-start color-input '
    field.className = 'form-control'
    field.name = 'color'
    field.type = 'color'
    field.style = 'width: revert; margin: 5px 0px;'

    div.append(field)
    div.append(i)

    parent.appendChild(div)
  })

  // winner check box

  // Get all the checkboxes with the common class
  let checkboxes = document.querySelectorAll('.common-checkbox')

  // Add event listeners to each checkbox
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      // If this checkbox is checked, uncheck the other checkboxes
      if (this.checked) {
        checkboxes.forEach(function (otherCheckbox) {
          if (otherCheckbox != checkbox) {
            otherCheckbox.checked = false
          }
        })
      }
    })
  })

  // ##################

  $(document).on('keyup', '#searchUsers', function () {
    var value = $(this).val()
    let debounceTimer

    const url =
      window.location.origin + `/admin/users/search/agent?value=${value}`

    $('#loader').show()
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(function () {
      $('.selectUser').children().remove().end()
      $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        error: (error) => {},
        success: (response) => {
          $('.selectUser').children().remove().end()
          if (response?.error) toastr.error(response?.error)
          else if (response?.length > 0) {
            $('.selectUser').append('<option value="">Select User</option>')
            for (const data of response) {
              $('.selectUser').append(
                '<option value="' +
                  data?._id +
                  '" data-contact="' +
                  data?.countryCode +
                  data?.contactNumber +
                  '">' +
                  data?.firstName +
                  ' (' +
                  data?.email +
                  ')' +
                  '</option>'
              )
            }
          }
          $('.selectUser').trigger('chosen:updated')
          $('#loader').hide()
        }
      })
    }, 1000)
  })

  // ###################

  $('body').on('click', '.remove', function () {
    $(this).parents('.color-input').remove()
    $(this).closest('.color-input').remove()
  })
  $('#newSize').on('click', (e) => {
    var parent = document.querySelector('.size')
    var field = document.createElement('input')
    var div = document.createElement('div')
    var button = document.createElement('button')
    button.type = 'button'
    button.className = 'bi bi-x btn btn-danger btn-sm removeSize'
    button.style = 'margin: 6px;'
    div.className = 'd-flex align-items-start size-input '
    field.className = 'form-control'
    field.name = 'size'
    field.type = 'size'
    field.style = 'width: revert; margin: 5px 0px;'

    div.append(field)
    div.append(button)

    parent.appendChild(div)
  })
  $('body').on('click', '.removeSize', function () {
    $(this).parents('.size-input').remove()
    $(this).closest('.size-input').remove()
  })

  // sidebar

  const urlLocation = window.location
  if (urlLocation?.pathname) {
    let path = ''
    if (urlLocation?.pathname?.includes('/'))
      path = urlLocation?.pathname?.split('/')[1]
    if (path) {
      $('.sidebar-link').removeClass('active')
      $('.nav-content').removeClass('active show')
      $('.forms-' + path).addClass('active')
      $('.forms-' + path).addClass('active show')
    }
  }

  // targetted tab
  const opentargettedTab = window.location.search
  if (
    opentargettedTab?.length &&
    opentargettedTab &&
    opentargettedTab?.includes('path')
  ) {
    const className = opentargettedTab.split('=')[1]
    $('.nav-link').removeClass('active')
    $('.tab-pane').removeClass('active show')

    $('.' + className).addClass('active')
    $('#' + className).addClass('active show')
  }

  $('body').on('click', '.remove', function () {
    $(this).parents('.color-input').remove()
    $(this).closest('.color-input').remove()
  })
  $('#newSize').on('click', (e) => {
    var parent = document.querySelector('.size')
    var field = document.createElement('input')
    var div = document.createElement('div')
    var button = document.createElement('button')
    button.type = 'button'
    button.className = 'bi bi-x btn btn-danger btn-sm removeSize'
    button.style = 'margin: 6px;'
    div.className = 'd-flex align-items-start size-input '
    field.className = 'form-control'
    field.name = 'size'
    field.type = 'size'
    field.style = 'width: revert; margin: 5px 0px;'

    div.append(field)
    div.append(button)

    parent.appendChild(div)
  })
  $('body').on('click', '.removeSize', function () {
    $(this).parents('.size-input').remove()
    $(this).closest('.size-input').remove()
  })

  $('.clickable-row').click(function () {
    window.location = $(this).data('href')
  })

  // ##############

  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-top-center',
    preventDuplicates: false,
    onclick: null,
    showDuration: '3000',
    hideDuration: '1000',
    timeOut: '3000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
  }

  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Autoresize echart charts
   */
  const mainContainer = select('#main')
  if (mainContainer) {
    setTimeout(() => {
      new ResizeObserver(function () {
        select('.echart', true).forEach((getEchart) => {
          echarts.getInstanceByDom(getEchart).resize()
        })
      }).observe(mainContainer)
    }, 200)
  }
  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach((e) => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Sidebar toggle
   */
  if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function (e) {
      select('body').classList.toggle('toggle-sidebar')
    })
  }

  /**
   * Search bar toggle
   */
  if (select('.search-bar-toggle')) {
    on('click', '.search-bar-toggle', function (e) {
      select('.search-bar').classList.toggle('search-bar-show')
    })
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Initiate tooltips
   */
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  )
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
})
