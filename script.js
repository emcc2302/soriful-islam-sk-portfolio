document.addEventListener("DOMContentLoaded", () => {
  const switchInput = document.getElementById("switch");
  const body = document.body;

  // Set default mode to dark
  body.classList.add("dark-mode");

  switchInput.addEventListener("change", () => {
    if (switchInput.checked) {
      // Light Mode
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
    } else {
      // Dark Mode
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
    }
  });
});



//for see more button 

document.addEventListener("DOMContentLoaded", () => {
  const seeMoreBtn = document.querySelector(".btn-secondary");
  const projectContainer = document.querySelector(".project");

  const extraProjects = [
    {
      title: "Project Seven",
      tech: "HTML, CSS",
      github: "https://github.com/emcc2302/Amazon-Clone",
      live: "#",
      img: "assets/project/project-seven.png"
    },
    {
      title: "Project Eight",
      tech: "HTML, CSS",
      github: "https://github.com/emcc2302/banglar-shasya-bima",
      live: "https://emcc2302.github.io/banglar-shasya-bima/",
      img: "assets/project/project-eight.png"
    },
    {
      title: "Project Nine",
      tech: "HTML, CSS, JS",
      github: "https://github.com/emcc2302/health-tracker",
      live: "https://emcc2302.github.io/health-tracker/",
      img: "assets/project/project-nine.png"
    },
    {
      title: "Project Ten",
      tech: "HTML, CSS",
      github: "#",
      live: "#",
      img: "assets/project/project-ten.png"
    },
    {
      title: "Project Eleven",
      tech: "HTML, CSS, JS",
      github: "#",
      live: "#",
      img: "assets/project/project-eleven.png"
    },
    {
      title: "Project Twelve",
      tech: "HTML, CSS",
      github: "#",
      live: "#",
      img: "assets/project/project-twelve.png"
    },
    // Add more here
  ];

  let currentIndex = 0;
  const projectsPerClick = 3;

  function loadNextProjects() {
    const nextProjects = extraProjects.slice(currentIndex, currentIndex + projectsPerClick);

    nextProjects.forEach((proj) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${proj.img}" alt="${proj.title}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">
        <div class="project-info">
          <div class="project-bio">
            <h3>${proj.title}</h3>
            <p>${proj.tech}</p>
          </div>
          <div class="project-link">
            <a href="${proj.github}" target="_blank"><i class="fab fa-github"></i></a>
            <a href="${proj.live}" target="_blank"><i class="fas fa-globe"></i></a>
          </div>
        </div>
      `;

      projectContainer.appendChild(card);
    });

    currentIndex += projectsPerClick;

    if (currentIndex >= extraProjects.length) {
      seeMoreBtn.innerText = "No More Projects";
      seeMoreBtn.disabled = true;
    }
  }

  seeMoreBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loadNextProjects();
  });
});



// contact.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  function showPopup(message, type) {
    const popup = document.getElementById("popup");
    const popupContent = document.getElementById("popup-content");

    popupContent.textContent = message;
    popup.className = `popup show ${type}`;

    setTimeout(() => {
      popup.className = "popup";
    }, 3000);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: data,
    })
      .then(() => {
        form.reset();
        showPopup("Message sent successfully!", "success");
      })
      .catch(() => {
        showPopup("Message failed to send.", "error");
      });
  });
});


// document.addEventListener("DOMContentLoaded", () => {
//   const hamburger = document.getElementById("hamburger");
//   const navMenu = document.querySelector(".header-content");

//   hamburger.addEventListener("click", () => {
//     hamburger.classList.toggle("active");
//     navMenu.classList.toggle("active");
//   });
// });


document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".header-content");
  const navLinks = document.querySelectorAll(".header-content a");

  // Toggle menu on hamburger click
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when any nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
});

// for footer email

 document.getElementById("smartEmailLink").addEventListener("click", function (e) {
    e.preventDefault();

    // Simple device check
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Open default mail app on mobile
      window.location.href = "mailto:sorifulislamsk1@gmail.com";
    } else {
      // Open Gmail compose in browser on desktop
      window.open("https://mail.google.com/mail/?view=cm&to=sorifulislamsk1@gmail.com", "_blank");
    }
  });