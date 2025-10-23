/* 
	Dynamic blocks v1

	Released on: November 02, 2024
	
	Инструкция по настройке смещения блоков:
	1. data-breakpoints - при каком разрешении смещаем выбранный блок
    2. data-targets - куда смещаем (в плане обёртки блоков, так как условно блоков с классом title может быть 10 штук на странице) 
    3. data-references - под какой блок/тег с классом или без смещаем нужный блок
    4. data-positions - позиция для смещения "before" над блоком, "after" - под блок 
	
	Пример блока:
    <div class="widget" 
       data-breakpoints="767" 
       data-targets=".footer" 
       data-references=".footer__bottom-col" 
       data-positions="before">
       Тут контент
    </div>

*/

document.addEventListener("DOMContentLoaded", function () {
  const originalPositions = new Map();
  const lastContainers = new Map();

  function moveElement(element, targetSelector, referenceSelector, position) {
    const target = document.querySelector(targetSelector);

    if (target && element.parentElement !== target) {
      if (referenceSelector) {
        const reference = target.querySelector(referenceSelector);
        if (reference) {
          if (position === "before") {
            reference.parentNode.insertBefore(element, reference);
          } else if (position === "after") {
            reference.parentNode.insertBefore(element, reference.nextSibling);
          }
        } else {
          target.appendChild(element);
        }
      } else {
        target.appendChild(element);
      }
      lastContainers.set(element, target);
    }
  }

  function restoreOriginalPosition(element) {
    const original = originalPositions.get(element);
    if (original && element.parentElement !== original.parent) {
      original.parent.insertBefore(element, original.nextSibling);
      lastContainers.set(element, original.parent);
    }
  }

  function handleResize() {
    document.querySelectorAll("[data-breakpoints]").forEach(element => {
      const breakpoints = element.getAttribute("data-breakpoints").split(",").map(Number);
      const targets = element.getAttribute("data-targets").split(",");
      const references = element.getAttribute("data-references") ? element.getAttribute("data-references").split(",") : [];
      const positions = element.getAttribute("data-positions") ? element.getAttribute("data-positions").split(",") : [];

      let moved = false;

      for (let i = 0; i < breakpoints.length; i++) {
        if (window.innerWidth <= breakpoints[i]) {
          const currentTarget = document.querySelector(targets[i]);
          if (lastContainers.get(element) !== currentTarget) {
            moveElement(element, targets[i], references[i] || null, positions[i] || "after");
          }
          moved = true;
          break;
        }
      }

      if (!moved) {
        restoreOriginalPosition(element);
      }
    });
  }

  document.querySelectorAll("[data-breakpoints]").forEach(element => {
    originalPositions.set(element, {
      parent: element.parentElement,
      nextSibling: element.nextSibling
    });
  });

  handleResize();
  window.addEventListener("resize", handleResize);
});
