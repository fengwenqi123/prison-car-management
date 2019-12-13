<template>
  <div class="video" id="video">
    <object id="testocx" width="1700" height="1000" classid="CLSID:3B514AD7-B152-4211-AECC-B9E9EF01DB2E">
    </object>
  </div>
</template>

<script>
  /* eslint-disable no-undef */

  function getVideo() {
    window.addEventListener('message', _getVideo, false)
  }

  function _getVideo(e) {
    if (e.data.hasOwnProperty('act')) {
      if (e.data.act === 'screen') {
        init(JSON.parse(e.data.msg.obj))
      }
    }
  }

  $(function() {
    getVideo()
  })

  function init(obj) {
    ChangeWindowNum()
    obj.forEach((item, index) => {
      PlayIt(item, index)
    })
  }

  function ChangeWindowNum() {
    // 调用该函数改变画面数
    testocx.WindNum = 9 // 1,4,6,8,9,16,25,36
    testocx.IsDesign = false
  }

  function PlayIt(item, index) {
    testocx.PlayIndex = index
    testocx.TransType = 0
    testocx.Ipaddress = item.ip
    testocx.MediaServerIP = '192.168.253.54'
    testocx.Channel = item.channel
    testocx.Username = item.account
    testocx.Password = item.password
    testocx.DevicePort = item.port
    testocx.DeviceType = 0
    testocx.AssChannel = 0
    testocx.Play()
  }
</script>
<style lang="scss" scoped>
</style>
