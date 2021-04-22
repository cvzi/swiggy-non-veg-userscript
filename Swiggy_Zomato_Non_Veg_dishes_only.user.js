// ==UserScript==
// @name         Swiggy & Zomato: Non Veg dishes only
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  On Swiggy and Zomato you can select to show vegetarian dishes only, this script does the reverse: it allows you to hide vegetarian dishes
// @author       cuzi
// @copyright    2021, cuzi (https://openuserjs.org/users/cuzi)
// @license      GPL-3.0-or-later
// @match        https://www.swiggy.com/*
// @match        https://www.zomato.com/*
// @icon         https://res.cloudinary.com/swiggy/image/upload/portal/c/icon-192x192.png
// @grant        none
// ==/UserScript==

/*
    Copyright (C) 2021, cuzi (https://openuserjs.org/users/cuzi)
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/* globals Node */

(function () {
  'use strict'

  if (document.location.hostname.endsWith('.swiggy.com')) {
    const addNonVegToggle = function () {
      let label
      let orgDiv
      let newDiv
      let newCheckbox
      const orgClick = function () {
        if (newCheckbox.checked) {
          console.debug('orgClick: already non-veg, reset it')
          resetNonVeg()
        }
      }
      const resetNonVeg = function () {
        document.querySelectorAll('.hiddenbyscript').forEach(function (menuItem) {
          menuItem.classList.remove('hiddenbyscript')
          menuItem.style.display = ''
        })
        newCheckbox.checked = false
      }
      const enableNonVeg = function (ev) {
        if (ev) {
          ev.preventDefault()
          ev.stopPropagation()
        }
        if (newCheckbox.checked) {
          console.debug('enableNonVeg: already non-veg, reset it')
          resetNonVeg()
          return
        }

        if (orgDiv.querySelector('input[type=checkbox]').checked) {
          console.debug('enableNonVeg: org checkbox is checked, click it and wait')
          orgDiv.querySelector('input[type=checkbox]').click()
          window.setTimeout(enableNonVeg, 500)
          newDiv.querySelector('label').style.backgroundColor = '#87d'
          return
        }

        console.debug('enableNonVeg: hide menu items')
        document.querySelectorAll('[itemtype="http://schema.org/MenuItem"]').forEach(function (menuItem) {
          const icon = menuItem.querySelector('.icon-foodSymbol')
          if (icon && icon.className.toLowerCase().indexOf('veg') !== -1) {
            menuItem.classList.add('hiddenbyscript')
            menuItem.style.display = 'none'
          }
        })
        newCheckbox.checked = true
        newDiv.querySelector('label').style.backgroundColor = ''
      }
      const labels = document.querySelectorAll('label')
      labels.forEach(function (l) {
        if (l.textContent.toLowerCase().indexOf('veg') !== -1 && l.textContent.toLowerCase().indexOf('only') !== -1) {
          label = l
          orgDiv = label.firstElementChild
          newDiv = orgDiv.cloneNode(true)
          label.appendChild(newDiv)
          label.parentNode.style.width = (label.parentNode.clientWidth + newDiv.clientWidth + 17) + 'px'
          if (newDiv.tagName === 'INPUT') {
            newCheckbox = newDiv
          } else {
            newCheckbox = newDiv.querySelector('input[type=checkbox]')
          }
          newCheckbox.checked = false
          newDiv.setAttribute('id', 'nonVegToggle')
          newDiv.querySelectorAll('span').forEach(function (span) {
            if (span.firstChild && span.firstChild.nodeType === Node.TEXT_NODE && span.textContent.toLowerCase().indexOf('veg') !== -1) {
              span.innerHTML = 'Non veg'
            }
          })
          newDiv.addEventListener('click', enableNonVeg)
          orgDiv.addEventListener('click', orgClick)
        }
      })
    }
    window.setInterval(function () {
      if (!document.getElementById('nonVegToggle')) {
        addNonVegToggle()
      }
    }, 1000)
  } else if (document.location.hostname.endsWith('.zomato.com')) {
    const addNonVegToggle = function () {
      let label
      let orgDiv
      let newDiv
      let newCheckbox
      const orgClick = function () {
        if (newCheckbox.checked) {
          console.debug('orgClick: already non-veg, reset it')
          resetNonVeg()
        }
      }
      const resetNonVeg = function () {
        document.querySelectorAll('.hiddenbyscript').forEach(function (menuItem) {
          menuItem.classList.remove('hiddenbyscript')
          menuItem.style.display = ''
        })
        newCheckbox.checked = false
      }
      const enableNonVeg = function (ev) {
        if (ev) {
          ev.preventDefault()
          ev.stopPropagation()
        }

        if (newCheckbox.checked) {
          console.debug('enableNonVeg: already non-veg, reset it')
          resetNonVeg()
          return
        }

        if (orgDiv.checked) {
          console.debug('enableNonVeg: org checkbox is checked, click it and wait')
          orgDiv.click()
          window.setTimeout(enableNonVeg, 500)
          newCheckbox.style.backgroundColor = '#87d'
          return
        }

        console.debug('enableNonVeg: hide menu items')
        document.querySelectorAll('[type="veg"] [type="veg"]').forEach(function (symbol) {
          const menuItem = symbol.parentNode.parentNode.parentNode.parentNode
          menuItem.classList.add('hiddenbyscript')
          menuItem.style.display = 'none'
        })
        newCheckbox.checked = true
        newCheckbox.style.backgroundColor = ''
      }
      const labels = document.querySelectorAll('label')
      labels.forEach(function (l) {
        if (l.textContent.toLowerCase().indexOf('veg') !== -1 && l.textContent.toLowerCase().indexOf('only') !== -1) {
          label = l
          orgDiv = label
          newDiv = orgDiv.cloneNode(true)
          label.parentNode.appendChild(newDiv)
          label.parentNode.style.width = (label.parentNode.clientWidth + newDiv.clientWidth + 17) + 'px'
          newCheckbox = newDiv.querySelector('input[type=checkbox]')
          newCheckbox.checked = false
          newDiv.setAttribute('id', 'nonVegToggle')
          newDiv.childNodes.forEach(function (c) {
            if (c.nodeType === Node.TEXT_NODE && c.textContent.toLowerCase().indexOf('veg') !== -1) {
              c.textContent = 'Non veg'
            }
          })
          newDiv.addEventListener('click', enableNonVeg)
          orgDiv.addEventListener('click', orgClick)
        }
      })
    }
    window.setInterval(function () {
      if (!document.getElementById('nonVegToggle')) {
        addNonVegToggle()
      }
    }, 1000)
  }
})()
