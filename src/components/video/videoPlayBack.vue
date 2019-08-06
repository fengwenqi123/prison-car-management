<template>
  <div class="video">
    <object id="testocx" width="346" height="230" classid="CLSID:90D43DFD-D1C9-4D54-B4E4-964A4E6B28D7">
    </object>
  </div>
</template>

<script>
  /* eslint-disable no-undef,no-unused-vars */
  var logID = null
  var PlayHandle = null
  var ip = ''
  var Username = ''
  var Password = ''
  var Channel = ''
  var DevicePort = ''
  var DeviceType = null
  var moveTimeString = null
  var leaveTimeString = null

  function PlayIt() {
    testocx.Ipaddress = ip
    testocx.Channel = Channel
    testocx.Username = Username
    testocx.Password = Password
    testocx.DevicePort = DevicePort
    testocx.DeviceType = DeviceType
    testocx.StartTime = moveTimeString
    testocx.EndTime = leaveTimeString
    logID = testocx.LoginDvr()
    PlayHandle = testocx.RemotePlay(-1)
  }

  function StopIt() {
    // testocx.PlayIndex=0; // 停掉哪个画面  网页关闭时必须对每个画面在播放的画面停掉
    testocx.StopPlayBack(PlayHandle)
    PlayHandle = null
    logID = null
  }

  $(function() {
    getBack()
  })

  function getBack() {
    window.addEventListener('message', getR, false)
  }

  function getR(e) {
    var video
    if (e.data.hasOwnProperty('act')) {
      if (e.data.act === 'postVideoInfo') {
        video = e.data.msg.obj
        console.log(video)
        ip = video.vcrIp
        Username = video.vcrAccount
        Password = video.vcrPassword
        Channel = video.vcrChannel
        DevicePort = video.vcrPort
        moveTimeString = video.moveTimeString.substring(0, 19)
        leaveTimeString = e.data.msg.lastTime.substring(0, 19)
        if (video.code.indexOf('DH') !== -1) {
          DeviceType = 11
        } else {
          DeviceType = 1
        }
        if (PlayHandle !== null) {
          StopIt()
        }
        PlayIt()
      } else if (e.data.act === 'suspendTime') {
        testocx.RemotePlayControl(PlayHandle, 3, 0)
      } else if (e.data.act === 'speed') {
        var speed = parseFloat(e.data.msg.speed)
        console.log(speed)
        for (var i = 0; i <= speed; i++) {
          testocx.RemotePlayControl(PlayHandle, 5, 0)
        }
      } else if (e.data.act === 'stopTime') {
        StopIt()
      } else if (e.data.act === 'startTime') {
        video = e.data.msg.obj
        if (video.code.indexOf('DH') !== -1) {
          DeviceType = 11
        } else {
          DeviceType = 1
        }
        ip = video.vcrIp
        Username = video.vcrAccount
        Password = video.vcrPassword
        Channel = video.vcrChannel
        DevicePort = video.vcrPort
        moveTimeString = video.moveTimeString.substring(0, 19)
        leaveTimeString = e.data.msg.lastTime.substring(0, 19)
        if (PlayHandle !== null) {
          StopIt()
        }
        PlayIt()
      }
    }
  }
</script>
