#!/usr/bin/env node

/**
 * Comprehensive Blog Content Backup System
 * Backs up all blog content from various sources
 */

import fs from 'fs';
import path from 'path';

const backupDate = new Date().toISOString().split('T')[0];
const backupDir = './blog_backups';

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

async function backupBlogContent() {
  console.log('🔄 Starting comprehensive blog content backup...');
  
  const backupData = {
    backupDate,
    backupTime: new Date().toISOString(),
    sources: {},
    totalFiles: 0,
    notes: 'Complete backup of all blog content and AI-generated materials'
  };

  // Files to backup
  const filesToBackup = [
    'seo-blogs-data.json',
    'location_blogs_collection.json', 
    'blog_alaska_generated.json',
    'blog_california_generated.json',
    'blog_colorado_generated.json',
    'blog_oregon_generated.json',
    'blog_washington_generated.json',
    'blog_post_generated.json',
    'viral_content_strategy.json',
    'current_blog_data_backup.json'
  ];

  // Backup each file
  for (const filename of filesToBackup) {
    if (fs.existsSync(filename)) {
      try {
        const content = fs.readFileSync(filename, 'utf8');
        const backupFilename = `${filename.replace('.json', '')}-backup-${backupDate}.json`;
        const backupPath = path.join(backupDir, backupFilename);
        
        fs.writeFileSync(backupPath, content);
        backupData.sources[filename] = {
          backed_up: true,
          backup_file: backupFilename,
          size: Buffer.byteLength(content, 'utf8')
        };
        backupData.totalFiles++;
        console.log(`✅ Backed up: ${filename} -> ${backupFilename}`);
      } catch (error) {
        console.error(`❌ Failed to backup ${filename}:`, error.message);
        backupData.sources[filename] = {
          backed_up: false,
          error: error.message
        };
      }
    } else {
      console.log(`⚠️  File not found: ${filename}`);
      backupData.sources[filename] = {
        backed_up: false,
        error: 'File not found'
      };
    }
  }

  // Save backup manifest
  const manifestPath = path.join(backupDir, `backup-manifest-${backupDate}.json`);
  fs.writeFileSync(manifestPath, JSON.stringify(backupData, null, 2));
  
  console.log(`\n📊 Backup Summary:`);
  console.log(`   - Total files processed: ${filesToBackup.length}`);
  console.log(`   - Successfully backed up: ${backupData.totalFiles}`);
  console.log(`   - Backup directory: ${backupDir}`);
  console.log(`   - Manifest file: ${manifestPath}`);
  
  return backupData;
}

// Run backup
backupBlogContent()
  .then((result) => {
    console.log('\n✅ Blog content backup completed successfully!');
    console.log(`📄 Manifest saved with ${result.totalFiles} files`);
  })
  .catch((error) => {
    console.error('\n❌ Backup failed:', error);
    process.exit(1);
  });