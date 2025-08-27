$(document).ready(function () {
  let eventDataTable = ''
  let dataTable = ''
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }
  const datatables = select('.datatable', true)
  datatables.forEach((datatable) => {
    let pageNumber = 0
    let limit = 20
    const dataTableObject = new simpleDatatables.DataTable(datatable, {
      pageLength: 50000,
      hiddenHeader: false
    })

    //page number on change
    dataTableObject.on('datatable.page', function (page) {
      if (+pageNumber < +page) {
        pageNumber = page
        pagination(pageNumber, limit, dataTableObject)
      }
    })

    // searching
    let setTimeOut
    dataTableObject.on('datatable.search', function (query, matched) {
      clearTimeout(setTimeOut)
      setTimeOut = setTimeout(() => {
        search(query, dataTableObject)
      }, 500)

      //
    })

    // change of the per page record
    dataTableObject.on('datatable.perpage', function (perpage) {
      if (limit < perpage) {
        limit = perpage
        pagination(pageNumber, limit, dataTableObject)
      }
    })
  })

  $('.datatable').on('click', 'tbody tr', function () {
    var href = $(this).find('a').attr('href')
    if (href) {
      window.location = href
    }
  })

  // ###################
  function search(query, dataTableObject) {
    let path = window.location.pathname.split('/')
    path = path.filter((item) => item)
    const model = path[0]
    $.ajax({
      type: 'post',
      url: window.location.origin + '/pagination/search',
      dataType: 'json',
      data: {
        model,
        query
      },
      error: (error) => {
        console.log(' ----- error ---- ', error)
      },
      success: (response) => {
        let pageNumber = 1
        const array = []
    
        if (array.length > 0) {
          dataTableObject.insert(array)
          dataTableObject.update()
        }
      }
    })
  }

  function pagination(page, limit, dataTableObject) {
    let path = window.location.pathname.split('/')
    path = path.filter((item) => item)
    const model = path[0]

    let url = window.location.origin + '/salesPagination'
    if (window.location.origin.includes('admin')) {
      url = window.location.origin + '/pagination'
    }

    $.ajax({
      type: 'post',
      url: url,
      dataType: 'json',
      data: {
        model,
        pageNumber: page,
        limit
      },
      error: (error) => {
        console.log(' ----- error ---- ', error)
      },
      success: (response) => {
        let pageNumber = 1
        pageNumber = page || 1
        if (page !== 0) pageNumber = page * limit
        pageNumber += 1
        const array = []
  

        dataTableObject.insert(array)
        dataTableObject.update()
      }
    })
  }
})
