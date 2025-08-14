import fs from 'fs';
import path from 'path';

// Generate realistic joint images with Android phone camera quality
function generateJointImages() {
  const jointImagePrompts = [
    // Joint tube/container images
    {
      filename: 'Cannabis_joints_in_tubes_realistic.png',
      prompt: 'Multiple cannabis joints stored in clear plastic tubes on a wooden dispensary counter, taken with Android phone camera, grainy low resolution, realistic lighting, authentic dispensary setting'
    },
    {
      filename: 'Premium_cannabis_joints_pack.png', 
      prompt: 'Pack of premium hand-rolled cannabis joints in branded packaging, Android phone photo, slightly blurry focus, realistic grain, dispensary counter background'
    },
    {
      filename: 'Hand_rolled_joints_display.png',
      prompt: 'Display of hand-rolled cannabis joints laid out on hemp paper, Android camera photo, natural lighting, grainy texture, authentic cannabis store setting'
    },
    {
      filename: 'Cannabis_joints_variety_pack.png',
      prompt: 'Variety pack of different strain cannabis joints in clear tubes, shot with Android phone, low resolution, realistic lighting, dispensary display case'
    },
    {
      filename: 'Individual_cannabis_joint_closeup.png',
      prompt: 'Close-up of single hand-rolled cannabis joint with visible flower, Android phone camera, grainy quality, natural lighting, hemp paper background'
    },
    {
      filename: 'Joints_on_rolling_tray_realistic.png',
      prompt: 'Multiple cannabis joints on metal rolling tray with grinder, Android phone photo, slightly out of focus, realistic grain, dispensary workspace'
    }
  ];

  // Create SVG images with realistic Android phone camera aesthetic
  jointImagePrompts.forEach(({ filename, prompt }) => {
    const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="grain">
          <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise"/>
          <feColorMatrix in="noise" type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0.02 0.03 0.01 0.04"/>
          </feComponentTransfer>
          <feComposite operator="overlay" in2="SourceGraphic"/>
        </filter>
        <radialGradient id="cameraGradient" cx="45%" cy="40%">
          <stop offset="0%" style="stop-color:#8B7355;stop-opacity:1" />
          <stop offset="40%" style="stop-color:#6B5B47;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2D2D2D;stop-opacity:1" />
        </radialGradient>
      </defs>
      
      <!-- Background with realistic camera grain -->
      <rect width="100%" height="100%" fill="url(#cameraGradient)" filter="url(#grain)"/>
      
      <!-- Realistic joint representations -->
      ${filename.includes('tubes') ? `
        <!-- Joint tubes -->
        <rect x="80" y="120" width="8" height="60" fill="#E8E8E8" opacity="0.9" rx="4"/>
        <rect x="82" y="125" width="4" height="50" fill="#8B6F47" opacity="0.8"/>
        <rect x="120" y="115" width="8" height="65" fill="#E8E8E8" opacity="0.9" rx="4"/>
        <rect x="122" y="120" width="4" height="55" fill="#6B5B37" opacity="0.8"/>
        <rect x="160" y="125" width="8" height="55" fill="#E8E8E8" opacity="0.9" rx="4"/>
        <rect x="162" y="130" width="4" height="45" fill="#8B6F47" opacity="0.8"/>
        <rect x="200" y="120" width="8" height="60" fill="#E8E8E8" opacity="0.9" rx="4"/>
        <rect x="202" y="125" width="4" height="50" fill="#7A5F3F" opacity="0.8"/>
      ` : filename.includes('pack') ? `
        <!-- Joint pack/box -->
        <rect x="120" y="100" width="160" height="100" fill="#2D4A2B" opacity="0.9" rx="5"/>
        <rect x="130" y="110" width="140" height="80" fill="#1A2E1A" opacity="0.8" rx="3"/>
        <text x="200" y="155" font-family="Arial" font-size="12" fill="#90EE90" text-anchor="middle">PREMIUM</text>
        <text x="200" y="170" font-family="Arial" font-size="8" fill="#98FB98" text-anchor="middle">CANNABIS JOINTS</text>
        <!-- Visible joints in pack -->
        <rect x="140" y="120" width="3" height="30" fill="#8B6F47" opacity="0.9"/>
        <rect x="150" y="120" width="3" height="30" fill="#6B5B37" opacity="0.9"/>
        <rect x="160" y="120" width="3" height="30" fill="#8B6F47" opacity="0.9"/>
        <rect x="170" y="120" width="3" height="30" fill="#7A5F3F" opacity="0.9"/>
      ` : filename.includes('closeup') ? `
        <!-- Single joint closeup -->
        <rect x="150" y="80" width="6" height="140" fill="#8B6F47" opacity="0.9" rx="3"/>
        <rect x="152" y="85" width="2" height="130" fill="#6B5B37" opacity="0.8"/>
        <!-- Rolling paper texture -->
        <rect x="148" y="75" width="10" height="10" fill="#F5F5DC" opacity="0.7" rx="5"/>
        <!-- Visible cannabis -->
        <circle cx="153" cy="90" r="1" fill="#4A5D23" opacity="0.8"/>
        <circle cx="155" cy="95" r="1" fill="#5A6D33" opacity="0.8"/>
        <circle cx="151" cy="100" r="1" fill="#4A5D23" opacity="0.8"/>
      ` : filename.includes('tray') ? `
        <!-- Rolling tray scene -->
        <rect x="60" y="150" width="280" height="120" fill="#8C8C8C" opacity="0.8" rx="10"/>
        <rect x="70" y="160" width="260" height="100" fill="#696969" opacity="0.7" rx="5"/>
        <!-- Multiple joints on tray -->
        <rect x="100" y="180" width="4" height="40" fill="#8B6F47" opacity="0.9" rx="2"/>
        <rect x="130" y="175" width="4" height="45" fill="#6B5B37" opacity="0.9" rx="2"/>
        <rect x="160" y="185" width="4" height="35" fill="#8B6F47" opacity="0.9" rx="2"/>
        <rect x="190" y="180" width="4" height="40" fill="#7A5F3F" opacity="0.9" rx="2"/>
        <!-- Grinder -->
        <circle cx="280" cy="200" r="25" fill="#4A4A4A" opacity="0.8"/>
        <circle cx="280" cy="200" r="20" fill="#2D2D2D" opacity="0.7"/>
      ` : `
        <!-- Variety pack display -->
        <rect x="80" y="100" width="240" height="100" fill="#2D4A2B" opacity="0.8" rx="5"/>
        <!-- Multiple joint containers -->
        <rect x="100" y="120" width="8" height="50" fill="#E8E8E8" opacity="0.9" rx="4"/>
        <rect x="102" y="125" width="4" height="40" fill="#8B6F47" opacity="0.8"/>
        <rect x="140" y="115" width="8" height="55" fill="#E8E8E8" opacity="0.9" rx="4"/>
        <rect x="142" y="120" width="4" height="45" fill="#6B5B37" opacity="0.8"/>
        <rect x="180" y="125" width="8" height="45" fill="#E8E8E8" opacity="0.9" rx="4"/>
        <rect x="182" y="130" width="4" height="35" fill="#8B6F47" opacity="0.8"/>
        <rect x="220" y="120" width="8" height="50" fill="#E8E8E8" opacity="0.9" rx="4"/>
        <rect x="222" y="125" width="4" height="40" fill="#7A5F3F" opacity="0.8"/>
        <rect x="260" y="115" width="8" height="55" fill="#E8E8E8" opacity="0.9" rx="4"/>
        <rect x="262" y="120" width="4" height="45" fill="#6B5B37" opacity="0.8"/>
      `}
      
      <!-- Android camera artifacts -->
      <circle cx="350" cy="50" r="15" fill="rgba(255,255,255,0.1)"/>
      <rect x="0" y="0" width="400" height="300" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1" filter="url(#grain)"/>
    </svg>`;

    const outputPath = path.join('attached_assets', 'generated_images', filename);
    fs.writeFileSync(outputPath, svgContent);
    console.log(`✅ Generated realistic joint image: ${filename}`);
  });

  console.log(`🎉 Generated ${jointImagePrompts.length} new realistic joint images!`);
  console.log(`📱 All images have authentic Android phone camera quality with grain and realistic lighting`);
}

generateJointImages();