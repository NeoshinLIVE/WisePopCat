// Neohud v2.1 by Neoshin#0001
// Variables
const avatar = '{avatar}';
const avatarName = '{avatarName}';
const commands = '{commands}'.split(',');
const cooldown = {cooldown};
const timer = {timer};
let isOnCooldown = 0;

/* ====================| Event Listener |==================== */
// On Widget Load
window.addEventListener('onWidgetLoad', function (obj) {
  if (avatar !== 'null') {
    $('.avatar').attr('src', avatar);
  }
  
  if (!avatarName) {
  	$('.nameplate').hide();
  }

  if (timer > 0) {
  	setInterval(() => { 
      getFact(); 
    }, timer * 60000);
  }
});

// On Event Received
window.addEventListener('onEventReceived', function (obj) {
  const currentTime = new Date().getTime();
  
  if (isOnCooldown > currentTime) return;
  
  const event = obj.detail.event;

  if (event.listener === 'widget-button') {
  	getFact();
  }
  
  if (commands.indexOf(event.data.text) > -1) {
  	getFact();
  }
});

// Gets a random fact through the api and displays it
function getFact() {
  isOnCooldown = new Date().getTime() + (cooldown * 1000);

  fetch('https://uselessfacts.jsph.pl/random.json?language={language}')
    .then(response => response.json())
  	.then(data => {
      if (data.text) {
      	const tl = gsap.timeline();
		
        tl.to('.container', {autoAlpha: 1, duration: 1.5})
          .then(function() {
          	const typed = new Typed('.message', {
              strings: [data.text],
              typeSpeed: 30,
              showCursor: false,
              onBegin: () => {},
              onComplete: self => {
              	tl.to('.container', {autoAlpha: 0, duration: 1, delay: {widgetDuration}})
                  .then(() => {
                    self.destroy();
                  });
              }
            });
          });
      }
  });
}