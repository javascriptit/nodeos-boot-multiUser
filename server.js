#!/usr/bin/env node

const readFile = require('fs').readFile

const basicEnvironment = require('nodeos-boot-singleUser')
const linuxCmdline     = require('linux-cmdline')
const mountUsersFS     = require('nodeos-boot-singleUserMount')
const startRepl        = require('nodeos-mount-utils').startRepl

const prepareSessions = require('.')


const MOUNTPOINT = '/tmp'


/**
 * This error handler traces the error and starts a Node.js REPL
 *
 * @param  {Error} error The error that gets traced
 */
function onerror(error)
{
  console.trace(error)
  startRepl('NodeOS-boot-multiuser')
}


basicEnvironment(function(error)
{
  if(error) return onerror(error)

  // Get Linux kernel command line arguments
  readFile('/proc/cmdline', 'utf8', function(error, data)
  {
    if(error) return onerror(error)

    var cmdline = linuxCmdline(data)

    // Mount users filesystem
    mountUsersFS(MOUNTPOINT, cmdline, function(error)
    {
      if(error) return onerror(error)

      prepareSessions(MOUNTPOINT, cmdline.single, function(error)
      {
        if(error) return onerror(error)

        // KTHXBYE >^.^<
      })
    })
  })
})
