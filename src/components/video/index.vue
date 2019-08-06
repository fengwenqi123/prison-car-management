<template>
  <div class="video">
    <object id="testocx" width="346" height="230" classid="CLSID:90D43DFD-D1C9-4D54-B4E4-964A4E6B28D7">
    </object>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars,no-undef */
  var logID = null
  var PlayID = null
  var ip = ''
  var Username = ''
  var Password = ''
  var Channel = ''
  var DevicePort = ''
  var DeviceType = null

  function PlayIt() {
    testocx.Ipaddress = ip
    testocx.Channel = Channel
    testocx.Username = Username
    testocx.Password = Password
    testocx.DevicePort = DevicePort
    testocx.DeviceType = DeviceType
    logID = testocx.LoginDvr()
    PlayID = testocx.StartPlay()
  }

  function StopIt() {
    // testocx.PlayIndex=0; // 停掉哪个画面  网页关闭时必须对每个画面在播放的画面停掉
    // testocx.SetPlayID(PlayID)
    testocx.StopPlay()
    testocx.LogOutDVR(logID)
    PlayID = null
    logID = null
  }

  function getVideo() {
    window.addEventListener('message', _getVideo, false)
  }

  function _getVideo(e) {
    if (e.data.hasOwnProperty('act')) {
      if (e.data.act === 'video') {
        var obj = JSON.parse(e.data.msg.obj)
        ip = obj.ip
        Username = obj.account
        Password = obj.password
        Channel = obj.channel
        DevicePort = obj.port
        if (obj.code.indexOf('DH') !== -1) {
          DeviceType = 11
        } else {
          DeviceType = 1
        }
        if (PlayID !== null) {
          StopIt()
        }
        setTimeout(() => {
          PlayIt()
        }, 100)
      }
    }
  }

  $(function() {
    getVideo()
  })

</script>
