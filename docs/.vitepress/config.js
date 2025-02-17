export default {
    title: 'Ugreen NASync Guide',
    description: 'A comprehensive guide to Ugreen NASync',
    base: '/community-guide/',
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        // Add more navigation items if needed
      ],
      sidebar: [
        // Define your sidebar here
        {
          text: 'Introduction',
          items: [
            { text: 'What is Ugreen NASync?', link: '/introduction/what-is-nasync' },
            { text: 'What is this website?', link: '/introduction/what-is-this' },
            // Add more sidebar items
          ],
        },
        {
          text: 'Getting Started',
          items: [
            { 
              text: 'Official Beginner\'s Guide', 
              link: 'https://nas.ugreen.com/pages/nasync-series-beginner-guide',
              target: '_blank' // This makes the link open in a new tab
            },
            // Your other sidebar items...
          ]
        },
        {
          text: 'UGOS',
          items: [
            {
              text: 'Tweaks',
              items : [
                { text: 'Public Key SSH Authentication', link: '/ugos/tweak/ssh_public_key' }
              ]
            },
            {
              text: 'Custom Apps Install',
              items : [
                { text: 'Home Assistant', link: '/ugos/install/homeassistant' },
                { text: 'Nextcloud-AIO', link: '/ugos/install/nextcloud-aio' },
                { text: 'Ngnix Proxy Manager', link: '/ugos/install/npm' },
                { text: 'Tailscale', link: '/ugos/install/tailscale' }
              ]
            }
            // Add more sidebar items
          ],
        },
        {
        text: 'Advanced Guides',
        items: [
          { text: 'Accessing BIOS', link: '/advanced-guides/accessing-bios' },
          // ... other advanced guides
        ]
        },
        {
          text: 'Contributing',
          link: '/contributing'
        }
        // Add more sections
      ],
      search: {
        provider: 'local'
      }
    },
    ignoreDeadLinks: [
      // ignore all localhost links
      /^https?:\/\/localhost/,
      // ignore all raw githubusercontent links
      /^https?:\/\/raw.githubusercontent.com/,
    ]
  }
  
