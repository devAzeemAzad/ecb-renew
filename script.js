document.addEventListener("DOMContentLoaded", () => {
  class AdvancedSlider {
    constructor(container) {
      this.container = container;
      this.slides = container.querySelectorAll(".slides img");
      this.prevBtn = container.querySelector(".prev");
      this.nextBtn = container.querySelector(".next");
      this.dotsContainer = container.querySelector(".slider-dots");
      this.totalSlides = this.slides.length;
      this.currentSlideIndex = 0;
      this.autoSlideInterval = 6000;
      this.intervalId = null;
      this.touchStartX = 0;
      this.touchEndX = 0;

      this.init();
    }

    init() {
      // Create dots
      this.createDots();

      // Show initial slide
      this.showSlide(this.currentSlideIndex);

      // Start auto slide
      this.startAutoSlide();

      // Event listeners
      this.prevBtn.addEventListener("click", () => this.prevSlide());
      this.nextBtn.addEventListener("click", () => this.nextSlide());

      // Touch events for mobile
      this.container.addEventListener(
        "touchstart",
        (e) => this.handleTouchStart(e),
        { passive: true }
      );
      this.container.addEventListener(
        "touchend",
        (e) => this.handleTouchEnd(e),
        { passive: true }
      );

      // Pause on hover
      this.container.addEventListener("mouseenter", () =>
        this.pauseAutoSlide()
      );
      this.container.addEventListener("mouseleave", () =>
        this.startAutoSlide()
      );

      // Keyboard footerigation
      this.container.addEventListener("keydown", (e) => this.handleKeyDown(e));

      // Make slider focusable
      this.container.setAttribute("tabindex", "0");
    }

    createDots() {
      this.slides.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("slider-dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => this.goToSlide(index));
        this.dotsContainer.appendChild(dot);
      });
    }

    updateDots() {
      const dots = this.dotsContainer.querySelectorAll(".slider-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === this.currentSlideIndex);
      });
    }

    showSlide(index) {
      this.slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
      this.updateDots();
    }

    nextSlide() {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.totalSlides;
      this.showSlide(this.currentSlideIndex);
      this.resetAutoSlide();
    }

    prevSlide() {
      this.currentSlideIndex =
        (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
      this.showSlide(this.currentSlideIndex);
      this.resetAutoSlide();
    }

    goToSlide(index) {
      this.currentSlideIndex = index;
      this.showSlide(this.currentSlideIndex);
      this.resetAutoSlide();
    }

    startAutoSlide() {
      this.intervalId = setInterval(
        () => this.nextSlide(),
        this.autoSlideInterval
      );
    }

    pauseAutoSlide() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }

    resetAutoSlide() {
      this.pauseAutoSlide();
      this.startAutoSlide();
    }

    handleTouchStart(e) {
      this.touchStartX = e.changedTouches[0].screenX;
      this.pauseAutoSlide();
    }

    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      this.startAutoSlide();
    }

    handleSwipe() {
      const threshold = 50;
      if (this.touchEndX < this.touchStartX - threshold) {
        this.nextSlide();
      } else if (this.touchEndX > this.touchStartX + threshold) {
        this.prevSlide();
      }
    }

    handleKeyDown(e) {
      switch (e.key) {
        case "ArrowLeft":
          this.prevSlide();
          break;
        case "ArrowRight":
          this.nextSlide();
          break;
        case "Home":
          this.goToSlide(0);
          break;
        case "End":
          this.goToSlide(this.totalSlides - 1);
          break;
      }
    }
  }

  // Initialize all sliders on the page
  document.querySelectorAll(".slider").forEach((slider) => {
    if (
      slider.querySelector(".slides img") &&
      slider.querySelector(".prev") &&
      slider.querySelector(".next") &&
      slider.querySelector(".slider-dots")
    ) {
      new AdvancedSlider(slider);
    } else {
      console.warn("Slider structure is incorrect:", slider);
    }
  });

  // Enhanced Navbar with Active State
  const sections = [
    "insitute",
    "research",
    "faculty",
    "students",
    "consulting",
    "Innovation_Incubation",
    "Alumni",
    "staff",
    "culture_sport",
    "media",
  ];

  // Check for missing sections
  sections.forEach((section) => {
    if (!document.getElementById(section)) {
      console.warn(`Section with id "${section}" is missing.`);
    }
  });

  // Get all navbar items from both .navbar2 and .nav_hover
  const navbarItems = document.querySelectorAll(".navbar-item");
  const mainHeader = document.querySelector(".main-header h4");

  // Function to activate a navbar item and its corresponding section
  function activateNavItem(index) {
    // Update navbar items
    navbarItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add("active");
        item.setAttribute("aria-current", "page");
      } else {
        item.classList.remove("active");
        item.removeAttribute("aria-current");
      }
    });

    // Update sections visibility
    sections.forEach((section, i) => {
      const targetSection = document.getElementById(section);
      if (targetSection) {
        targetSection.classList.toggle("visible", i === index);
        targetSection.classList.toggle("active", i === index);
      }
    });

    // Update header with animation
    if (mainHeader) {
      const activeItem = navbarItems[index];
      mainHeader.textContent = activeItem.textContent.trim();

      // Trigger animation
      mainHeader.classList.remove("fadeIn");
      void mainHeader.offsetWidth; // Trigger reflow
      mainHeader.classList.add("fadeIn");
    }
  }

  // Add click event to each navbar item
  navbarItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      activateNavItem(index);

      // Optional: Update URL hash without page jump
      history.pushState(null, null, `#${sections[index]}`);
    });
  });

  // Check for hash on page load
  function checkInitialState() {
    const hash = window.location.hash.substring(1);
    const initialIndex = sections.indexOf(hash);
    const defaultIndex = 0; // Fallback to first item if no hash matches

    activateNavItem(initialIndex !== -1 ? initialIndex : defaultIndex);
  }

  // Handle browser back/forward navigation
  window.addEventListener("popstate", checkInitialState);

  // Initialize
  checkInitialState();
});


let media1 = document.getElementById("media1");
let culture_sport1 = document.getElementById("culture_sport1");
let staff1 = document.getElementById("staff1");
let Alumni1 = document.getElementById("Alumni1");
let Innovation_Incubation1 = document.getElementById("Innovation_Incubation1");
let consulting1 = document.getElementById("consulting1");
let students1 = document.getElementById("students1");

let nav_hover = document.getElementsByClassName("nav_hover")[0];
let navbar2 = document.getElementsByClassName("navbar2");

setInterval(() => {
  if (media1 && culture_sport1 && staff1 && Alumni1 && nav_hover && navbar2[0]) {
    // Check if all elements are present before proceeding

    // If the screen width is greater than 1650px, append Alumni1, staff1, culture_sport1, and media1 to navbar2
    if (document.body.offsetWidth > 1650) {
      if (!navbar2[0].contains(culture_sport1)) {
        navbar2[0].append(Alumni1, staff1, culture_sport1, media1);
      }
    } 
    // If the screen width is between 1340px and 1650px, append staff1 to navbar2
    else if (document.body.offsetWidth <= 1650 && document.body.offsetWidth > 1340) {
      if (!navbar2[0].contains(staff1)) {
        navbar2[0].append(staff1);
      }
    } 
    // If the screen width is between 1200px and 1340px, append Alumni1 to navbar2
    else if (document.body.offsetWidth <= 1340 && document.body.offsetWidth > 1200) {
      if (!navbar2[0].contains(Alumni1)) {
        navbar2[0].append(Alumni1);
      }
    } 



   // If the screen width is between 1100px and 1200px, append Alumni1 to nav_hover
    if (document.body.offsetWidth <= 1200 && document.body.offsetWidth > 1100) {
      if (!nav_hover.contains(Alumni1)) {
        nav_hover.append(Alumni1);
      }
    } 
    // If the screen width is between 1200px and 1340px, append staff1 to nav_hover
    else if (document.body.offsetWidth <= 1340 && document.body.offsetWidth > 1200) {
      if (!nav_hover.contains(staff1)) {
        nav_hover.append(staff1);
      }
    } 
    else if (document.body.offsetWidth <= 1650 && document.body.offsetWidth > 1340) {
      if (!nav_hover.contains(culture_sport1)) {
        nav_hover.append(culture_sport1, media1);
      }
    }
    


    if (document.body.offsetWidth < 413 && document.body.offsetWidth > 320) {
      if (!nav_hover.contains(students1)) {
        nav_hover.append(students1, consulting1, Innovation_Incubation1 ,Alumni1, staff1, culture_sport1, media1);
      }
    } 
    if (document.body.offsetWidth < 511 && document.body.offsetWidth > 413) {
      if (!nav_hover.contains(consulting1)) {
        nav_hover.append(consulting1, Innovation_Incubation1 ,Alumni1, staff1, culture_sport1, media1);
      }
    } 
    else if (document.body.offsetWidth < 600 && document.body.offsetWidth > 511) {
      if (!nav_hover.contains(Innovation_Incubation1)) {
        nav_hover.append(Innovation_Incubation1, Alumni1, staff1, culture_sport1, media1);
      }
    } 
    else if (document.body.offsetWidth < 773 && document.body.offsetWidth > 600) {
      if (!nav_hover.contains(Alumni1)) {
        nav_hover.append(Alumni1, staff1, culture_sport1, media1);
      }
    } 
    else if (document.body.offsetWidth < 833 && document.body.offsetWidth > 773) {
      if (!nav_hover.contains(staff1)) {
        nav_hover.append(staff1 ,culture_sport1, media1);
      }
    } 
    else if (document.body.offsetWidth < 926 && document.body.offsetWidth > 833) {
      if (!nav_hover.contains(culture_sport1)) {
        nav_hover.append(culture_sport1,media1);
      }
    } 
    // If the screen width is between 860px and 960px, append media1 to nav_hover
    else if (document.body.offsetWidth < 1004 && document.body.offsetWidth > 926) {
      if (!nav_hover.contains(media1)) {
        nav_hover.append(media1);
      }
    } 


    if (document.body.offsetWidth < 511 && document.body.offsetWidth > 413) {
      if (!navbar2[0].contains(students1)) {
        navbar2[0].append(students1);
      }
    } 
    else if (document.body.offsetWidth < 600 && document.body.offsetWidth > 511) {
      if (!navbar2[0].contains(consulting1)) {
        navbar2[0].append(consulting1);
      }
    } 
    else if (document.body.offsetWidth < 773 && document.body.offsetWidth > 600) {
      if (!navbar2[0].contains(Innovation_Incubation1)) {
        navbar2[0].append(Innovation_Incubation1);
      }
    } 
    else if (document.body.offsetWidth < 833 && document.body.offsetWidth > 773) {
      if (!navbar2[0].contains(Alumni1)) {
        navbar2[0].append(Alumni1);
      }
    } 
    else if (document.body.offsetWidth < 926 && document.body.offsetWidth > 833) {
      if (!navbar2[0].contains(staff1)) {
        navbar2[0].append(staff1);
      }
    } 
    else if (document.body.offsetWidth < 1004 && document.body.offsetWidth > 926) {
      if (!navbar2[0].contains(culture_sport1)) {
        navbar2[0].append(culture_sport1);
      }
    } 
    // If the screen width is between 1004px and 1100px, append media1 to navbar2[0]
    else if (document.body.offsetWidth < 1100 && document.body.offsetWidth > 1004) {
      if (!navbar2[0].contains(media1)) {
        navbar2[0].append(Alumni1, staff1, culture_sport1, media1);
      }
    } 
  }
}, 0);

// Update navbar on resize




document.addEventListener("DOMContentLoaded", () => {
  const navHover = document.querySelector(".nav_hover");
  const upArrow = document.querySelector(".up_arror");

  if (navHover && upArrow) {
    upArrow.addEventListener("click", () => {
      upArrow.style.transform = upArrow.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
      navHover.classList.toggle("visible");
      
    });
  
  }
});
document.addEventListener("DOMContentLoaded", () => {
let page_left = document.querySelector(".page_head");
let news_slider = document.querySelector(".latest-news-slider-button");
let page = document.querySelector (".page");

  if (news_slider && page_left) {
    if (document.body.offsetWidth < 1100) {
      page_left.style.left = "-241px"; // Initially hide the page_left element
      news_slider.addEventListener("click", () => {
        page_left.style.left = page_left.style.left === "-241px" ? "0" : "-241px";
      });

      document.addEventListener("click", (e) => {
        if (!page_left.contains(e.target)) {
          page_left.style.left = "-241px";
        }
      });
    }
  }
});


let page_right = document.querySelector(".page_right");
let page_right_slide = document.querySelector(".page-right-slide");
let principal = document.querySelector(".Principal");
let announcements_section = document.querySelector(".announcements_section");
if (page_right_slide && page_right && principal && announcements_section) {
  if (document.body.offsetWidth < 1100) {
    page_right.style.right = "-260px"; // Initially hide the page_right element
    page_right_slide.addEventListener("click", () => {
      page_right.style.right = page_right.style.right === "-260px" ? "0" : "-260px";
    });
    document.addEventListener("click", (e) => {
      if (!page_right.contains(e.target) && !principal.contains(e.target) && !announcements_section.contains(e.target)) {
        page_right.style.right = "-260px";
      }
    });
  }
}



let depart_down = document.querySelector(".container3 > .depar-text > .fa-chevron-down");
let depar_text = document.querySelector(".container3 > .depar-text");
let foot_depar_column = document.querySelector(".container3 > .foot_depar_colum");

if (document.body.offsetWidth <= 768) {
  foot_depar_column.style.display = "none"; // Initially hide the foot_depar_column element
  foot_depar_column.style.height = "0px"; // Set height to 0px for smooth transition
  if (depar_text && depart_down) {
    depar_text.addEventListener("click", () => {
      depart_down.style.transform = depart_down.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
      foot_depar_column.style.display = foot_depar_column.style.display === "none" ? "block" : "none";
      foot_depar_column.style.height = foot_depar_column.style.height === "0px" ? "auto" : "0px";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-container3 .nav-menu").forEach(element => {
    element.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent event propagation

      // Hide all other menus
      document.querySelectorAll(".nav-container3 .nav-menu").forEach(otherElement => {
        if (otherElement !== element) {
          otherElement.childNodes[3].style.display = "none";
          if (otherElement.childNodes[1]?.childNodes[1]) {
            otherElement.childNodes[1].childNodes[1].style.transform = "rotate(0deg)";
          }
        }
      });

      // Toggle the clicked menu
      const isActive = element.childNodes[3].style.display === "block";
      element.childNodes[3].style.display = isActive ? "none" : "block";
      if (element.childNodes[1]?.childNodes[1]) {
        const isRotate = element.childNodes[1].childNodes[1].style.transform === "rotate(180deg)";
        element.childNodes[1].childNodes[1].style.transform = isRotate ? "rotate(0deg)" : "rotate(180deg)";
        element.childNodes[1].childNodes[1].style.transition = "transform 0.3s ease-out"; // Add smooth transition
      }
    });
  });

  // Close all menus when clicking outside
  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-container3 .nav-menu").forEach(element => {
      element.childNodes[3].style.display = "none";
      if (element.childNodes[1]?.childNodes[1]) {
        element.childNodes[1].childNodes[1].style.transform = "rotate(0deg)";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  var nav_innersub_menu = document.querySelectorAll(".nav-container3 .nav-menu .nav-inner-menu .nav-innersub-menu");
  nav_innersub_menu.forEach(element => {
    const active = element.childNodes[3];
    const rotate = element.childNodes[1].childNodes[1];

    // Add transition for smooth toggle
    active.style.transition = "all 0.3s ease-out";
    rotate.style.transition = "transform 0.3s ease-out";

    element.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent event propagation

      // Hide all other menus
      nav_innersub_menu.forEach(otherElement => {
        if (otherElement !== element) {
          const otherActive = otherElement.childNodes[3];
          const otherRotate = otherElement.childNodes[1].childNodes[1];
          otherActive.style.display = "none";
          otherRotate.style.transform = "rotate(0deg)";
        }
      });

      // Toggle the clicked menu
      const isActive = active.style.display === "flex";
      active.style.display = isActive ? "none" : "flex";
      rotate.style.transform = isActive ? "rotate(0deg)" : "rotate(90deg)";
    });
  });

  // Close all menus when clicking outside
  document.addEventListener("click", () => {
    nav_innersub_menu.forEach(element => {
      const active = element.childNodes[3];
      const rotate = element.childNodes[1].childNodes[1];
      active.style.display = "none";
      rotate.style.transform = "rotate(0deg)";
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  var footer_menu = document.querySelectorAll(".container2 .footer-menu");
  footer_menu.forEach(element  => {
  console.log( element.childNodes);
    const active= element.childNodes[3];
    const rotate= element.childNodes[1].childNodes[1];
    element.addEventListener("mouseenter", () => {
      active.style.display="block";
      rotate.style.transform  = "rotate(180deg)";
      rotate.style.transition= "transform 0.3s ease-out";
    });   
    element.addEventListener("mouseleave", () => {
      active.style.display="none";
      rotate.style.transform  = "rotate(0deg)";
    });   
    // element.addEventListener("click", () => {
    //   active.style.display="none";
    //   rotate.style.transform  = "rotate(0deg)";
    // });   
  });
});
document.addEventListener("DOMContentLoaded", () => {
  var footer_innersub_menu = document.querySelectorAll(".container2 .footer-menu .footer-inner-menu .footer-innersub-menu");
  footer_innersub_menu.forEach(element  => {
    const active= element.childNodes[3];
    element.addEventListener("mouseenter", () => {
      active.style.display="flex";
    });   
    element.addEventListener("mouseleave", () => {
      active.style.display="none";
    });   
  });
});

function startTime() {
  const today = new Date();
  const hr = today.getHours() % 12 || 12;
  const min = String(today.getMinutes()).padStart(2, "0");
  const sec = String(today.getSeconds()).padStart(2, "0");
  const ap = today.getHours() < 12 ? "AM" : "PM";

  document.getElementById("clock").innerHTML = `${hr}:${min}:${sec} <span>${ap}</span>`;

  const options = { weekday: "short", day: "numeric", month: "long", year: "numeric" };
  document.getElementById("date").innerHTML = today.toLocaleDateString(undefined, options);

  setTimeout(startTime, 500);
}


document.addEventListener("DOMContentLoaded", () => {

  var nav_con3_slider = document.querySelector(".nav-con3-slider");
  var ri_menu_line = document.querySelector(".ri-menu-line");
  ri_menu_line.addEventListener("click" ,()=>{
    nav_con3_slider.style.left = nav_con3_slider.style.left === "-235px" ? "0px" : "-235px";
  })
  document.addEventListener("click", (e) => {
    if (!ri_menu_line.contains(e.target) && !nav_con3_slider.contains(e.target)) {
      nav_con3_slider.style.left = "-235px";
    }
  });
})

document.addEventListener("DOMContentLoaded", () => {
  const ri_more_2_line = document.querySelector(".ri-more-2-line");
  const nav_container1_left = document.querySelector(".nav-container1-left");

  if (ri_more_2_line && nav_container1_left) {
    ri_more_2_line.addEventListener("click", () => {
      nav_container1_left.style.left = nav_container1_left.style.left === "-516px" ? "-18px" : "-516px";
    });
    document.addEventListener("click", (e) => {
      if (!ri_more_2_line.contains(e.target) && !nav_container1_left.contains(e.target)) {
        nav_container1_left.style.left = "-516px";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
// Select the image element
const image = document.querySelector('.nav-container2-left img');

// Function to change the image based on viewport width
function handleViewportChange(e) {
  if (e.matches) {
    // Viewport is 700px or less
    image.src = 'banner2.shortpng.png'; // Smaller image

    } else {
    // Viewport is more than 700px
    image.src = 'banner2.png'; // Larger image
  }
}

// Create a media query list
const mediaQuery = window.matchMedia('(max-width: 700px)');

// Initial check
handleViewportChange(mediaQuery);

// Listen for changes in viewport width
mediaQuery.addEventListener('change', handleViewportChange);

})