# API开发文档

## 接口说明

- **Base URL**: `http://localhost:8080`
- **Content-Type**: `application/json`

## 通用响应格式

```json
{
    "code": 1,           // 状态码: 1表示成功，0表示错误
    "msg": "success",  // 响应消息，success表示成功，error表示错误
    "data": {}           // 响应数据
}
```



## bilibili相关接口

### 获取用户所有公开收藏夹的信息

* **URL**：/getBiliUserInfo

* **Method**:`POST`

* **请求参数**：

  ```json
  {
      "cookie": "DedeUserID=3546388136724719; DedeUserID__ckMd5=506f805066d716a2; buvid3=1807476A-7F80-D99B-E5FE-0997AF45C01146568infoc; b_nut=1741404246; _uuid=FCBB763B-11038-D476-83D8-FB897642459F47765infoc; buvid_fp=ca9812b375ef3668455d5a3e749439d6; buvid4=7407F76A-EC9B-4D91-1AC3-37315A9B646F76003-024030702-5HrQPE0TKUAebrL/81R3cz0H61hs4ENs1b7jO+iFOhJRezCjIkU8JK2GdY5nox1Q; rpdid=|(k|kY|kkkuu0J'u~RlRuRRRR; LIVE_BUVID=AUTO1617468049455269; theme-tip-show=SHOWED; CURRENT_QUALITY=80; theme-avatar-tip-show=SHOWED; enable_web_push=DISABLE; CURRENT_FNVAL=4048; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTgxMDg5NDgsImlhdCI6MTc1Nzg0OTY4OCwicGx0IjotMX0.vjGnfxrM2kjVX254m7wZ3c-yeC-mbTgc1lX6jsCpovQ; bili_ticket_expires=1758108888; SESSDATA=5df7239b%2C1773401752%2Caba6c%2A91CjA-9k3CxlTd-QMooSxRtPMA8BPIZMLjfM1rx-CD19aV1QKaYWhs4mXdyIRGCWA5E2wSVlhpdmRxbkhFN29qUGhFY09vdVlJWVF4Tmw0bmpuZVJnYkxHcFMtTVVENXdFVUlmYnRLS2dTTWFla2ZtX3hDRFFreHFwNXhCUHhEMV9jMFhna3NXeGxBIIEC; bili_jct=6ac4a5265df3faca4f5ab3ada99efcad; sid=pohtir7k; b_lsid=108CA3C10D_1994B646DD5; bsource=search_bing; bp_t_offset_3546388136724719=1112689330469470208; home_feed_column=4; browser_resolution=633-738",
      "upMid": "3546388136724719"
  }
  ```

  

* **Response**:

  ```json
  {
      "code": 1,
      "msg": "success",
      "data": {
          "total": 2,
          "collectionInfo": [
              {
                  "collectionId": "2565622919",
                  "collectionTitle": "默认收藏夹"
              },
              {
                  "collectionId": "3524656219",
                  "collectionTitle": "韩剧台词"
              }
          ]
      }
  }
  ```
  

### 获取用户收藏夹内详细信息

* **URL**:/getBiliCollectionInfo

* **Method**:`POST`

* **请求参数**：

  ```json
  {
      "collectionIds": ["3524656219","2565622919"]
  }
  ```

* **Response**

  ```json
  {
      "code": 1,
      "msg": "success",
      "data": [
          {
              "collectionTitle": "韩剧台词",
              "collectionCover": "http://i1.hdslb.com/bfs/archive/befe3500caa76b597d3f62a1fef4a4a50d405277.jpg",
              "videoInfoList": [
                  {
                      "title": "“看待死亡”",
                      "cover": "http://i2.hdslb.com/bfs/archive/0306be82fd41add89a04b7554c6ce5842b7e4f83.jpg",
                      "link": "https://www.bilibili.com/video/BV1ps9MYTEyc"
                  }
              ]
          },
          {
              "collectionTitle": "默认收藏夹",
              "collectionCover": "http://i2.hdslb.com/bfs/archive/6d55ce2a3264d3c1940572d20eebbea7269a32e4.jpg",
              "videoInfoList": [
                  {
                      "title": "浏览器还有进化版？这些功能你可能都没见过",
                      "cover": "http://i0.hdslb.com/bfs/archive/9edcd7bb3f7a8a4ae2248ebfc080c58eb4a160e3.jpg",
                      "link": "https://www.bilibili.com/video/BV1J1421k7zN"
                  }
              ]
          }
      ]
  }
  ```

  

## douyin相关接口

### 获取用户所有收藏视频信息

* **URL**:/getdouallcollection

* **Method**:`POST`

* **请求参数**：

  ```json
  {
      "cookie": "UIFID_TEMP=ad7b1e526ce029fae15c4fe388b5a88a6cfc5b31e687fc2dca11932336017cb54debb6d917109c0e0467fc3fab56b7d7b976ccba1fe6460ca9f5468c0b8fbe5e2ea50add2041a845879029813a696d8c; fpk1=U2FsdGVkX19jf8kZLytHhb74ltd5B+MJUZz0seodguXfGgIZ14T/i2EgfdJXejfjXS/mIbv0s9t/jDtyO7URpw==; fpk2=9fae7894890fe21cd77090af114aa2cd; UIFID=ad7b1e526ce029fae15c4fe388b5a88a6cfc5b31e687fc2dca11932336017cb54debb6d917109c0e0467fc3fab56b7d701018a607a320d7054607a825fad9b7e707007fa2c59a5c85974bc73e172074208b2ecf5b982b3a6a6382e96f4270600159e1058c7f3b505fe9e6bfd0a1796ceea962e20de8a39a27f2c64df63a52eef4a5e62f7a629763b59466632597bc430fbbd94160b779bde8267104a0907f6e5; enter_pc_once=1; s_v_web_id=verify_mem97l9m_0KkMDuH7_5Pk4_4HHJ_844h_7n1XdD8lzJ5F; passport_csrf_token=ac03073905b328f91f334845b316dffc; passport_csrf_token_default=ac03073905b328f91f334845b316dffc; __security_mc_1_s_sdk_crypt_sdk=c5185a1c-4fea-915e; __security_mc_1_s_sdk_cert_key=30d2e708-4005-b96c; bd_ticket_guard_client_web_domain=2; xgplayer_user_id=520506989154; is_staff_user=false; __security_server_data_status=1; SelfTabRedDotControl=%5B%5D; my_rd=2; SEARCH_RESULT_LIST_TYPE=%22single%22; dy_swidth=1506; dy_sheight=848; strategyABtestKey=%221758079446.276%22; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Atrue%2C%22volume%22%3A0.31%7D; FOLLOW_LIVE_POINT_INFO=%22MS4wLjABAAAAuGhjn-9id_qNHB6E7EaXyfx3hpm6e0WgXPdi6xSIv6IkDl2coOWez5nNEOHtEENy%2F1758124800000%2F0%2F1758079446687%2F0%22; __ac_signature=_02B4Z6wo00f01CAZ6WQAAIDDrbFQ7DhTfqggOe3AAGDSYh2VwAlrh5N6HDH3HlKdqFWB.al-Ic8pgpVnv.3DrthpPeRY-XK0-yHC7pSrYxep1TgH6.-W7VighMnXpOT1N0SReFU5GAJYZ1ofbf; passport_mfa_token=CjhWF1xch0Eo5P1OMLCc%2FyGEZI7rDhxdp8jGLineoI54iYsCkkniugDsYW9RPhOoaLoflN%2BJLJLMOBpKCjwAAAAAAAAAAAAAT3yYu0RwNbX%2FxYvJ0h5xy0yxTvnEerIqU7X2WtJABoQMTuOOzJTIfvOPdUnaL75N%2FKUQgrT8DRj2sdFsIAIiAQPdc8kZ; d_ticket=0f4de4b8250f8c2cfe6cbd4ae2302bd0d8872; passport_assist_user=ClNAk2txDqn7S1c005tF7Be7EsdUdQ9Ulh1XSv0gaBSmbVD6AeInQbbL43komz3vZS5jaTVag6QvsEVZumCvLv2lvINz5BCTfqPcvG7S9ZFfDa3pNBpKCjwAAAAAAAAAAAAAT3wauIRQrGzLJZc4_ED8kNQeXDNbS55OT8XP_aI0KGzMarZOzdsLOdUsQ_EiXIHEeA0QzbT8DRiJr9ZUIAEiAQNDyxK5; n_mh=9-mIeuD4wZnlYrrOvfzG3MuT6aQmCUtmr8FxV8Kl8xY; sid_guard=6c28417d2d92cef92745a219fd0ea461%7C1758079538%7C5183999%7CSun%2C+16-Nov-2025+03%3A25%3A37+GMT; uid_tt=a7f5f2c0fa0f5c12d4d729c927a336e37015d6e3dc8aea574e970e02947a26a4; uid_tt_ss=a7f5f2c0fa0f5c12d4d729c927a336e37015d6e3dc8aea574e970e02947a26a4; sid_tt=6c28417d2d92cef92745a219fd0ea461; sessionid=6c28417d2d92cef92745a219fd0ea461; sessionid_ss=6c28417d2d92cef92745a219fd0ea461; sid_ucp_v1=1.0.0-KDFhZmNhNWM0OWI5OGU3NGZiYTMwMDc4OWZmZjNiOWFlN2JhOGFkZDYKIgi7iKHk2ZKWhmgQstSoxgYY7zEgDDDetrHABjgHQPQHSAQaAmhsIiA2YzI4NDE3ZDJkOTJjZWY5Mjc0NWEyMTlmZDBlYTQ2MQ; ssid_ucp_v1=1.0.0-KDFhZmNhNWM0OWI5OGU3NGZiYTMwMDc4OWZmZjNiOWFlN2JhOGFkZDYKIgi7iKHk2ZKWhmgQstSoxgYY7zEgDDDetrHABjgHQPQHSAQaAmhsIiA2YzI4NDE3ZDJkOTJjZWY5Mjc0NWEyMTlmZDBlYTQ2MQ; login_time=1758079537082; _bd_ticket_crypt_cookie=71fa2ff51ee763b7427f0eb0298c1ffa; __security_mc_1_s_sdk_sign_data_key_web_protect=44c800ba-4a46-a993; publish_badge_show_info=%221%2C0%2C0%2C1758079543521%22; download_guide=%223%2F20250917%2F0%22; douyin.com; device_web_cpu_core=20; device_web_memory_size=8; architecture=amd64; xg_device_score=7.9191272394219645; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1506%2C%5C%22screen_height%5C%22%3A848%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A20%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A9.35%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A50%7D%22; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCRCtyMlFxZkErb3dURHBYTjlVWVpBVU03V2lXa2pUQTdKMTNQdTlSWGFXTmlyMW5NeG5BQndHQnYySThETXRGbTQ4Z2YyTnBIRXYvWEpJTnkwOUpWZXM9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; home_can_add_dy_2_desktop=%221%22; ttwid=1%7C4ukVNTbOQfB2dU1mrkXIGSxPNhIDt-o4aCVMBvksLWI%7C1758098882%7C17b58fb24c1faff8c4aefccb031a8bca09ac9be617ef0795d676a65102406656; biz_trace_id=fd706b9b; session_tlb_tag=sttt%7C15%7CbChBfS2SzvknRaIZ_Q6kYf_________gDDgYGoS1mutWR1KjCCw6456dpwwD8bbd0F14FEg86WQ%3D; sdk_source_info=7e276470716a68645a606960273f276364697660272927676c715a6d6069756077273f276364697660272927666d776a68605a607d71606b766c6a6b5a7666776c7571273f275e58272927666a6b766a69605a696c6061273f27636469766027292762696a6764695a7364776c6467696076273f275e582729277672715a646971273f2763646976602729277f6b5a666475273f2763646976602729276d6a6e5a6b6a716c273f2763646976602729276c6b6f5a7f6367273f27636469766027292771273f273d3637373d3d3d3c353d303234272927676c715a75776a716a666a69273f2763646976602778; gulu_source_res=eyJwX2luIjoiMzczYjUwZjEwMjE1MTQ5YzM3YTMxYjVjNjA1ZDk0Y2JmYTI2YzkwZWE5MGIxMTNiN2JhMmU1ZTVjNjAyOTJhZiJ9; passport_auth_mix_state=fxtnch6u17svkp0un1m8jkb1odhpgzgghgo8sfhwtw673mr0; odin_tt=09e22e67c8fe382217927ff23e1aba344c7858adb447a4d4b0d3f441d4bd012a776594bf664968fce0e513e281a7660960025c7abc3474f7810aebb4aecc7995; stream_player_status_params=%22%7B%5C%22is_auto_play%5C%22%3A0%2C%5C%22is_full_screen%5C%22%3A0%2C%5C%22is_full_webscreen%5C%22%3A0%2C%5C%22is_mute%5C%22%3A1%2C%5C%22is_speed%5C%22%3A1%2C%5C%22is_visible%5C%22%3A1%7D%22; WallpaperGuide=%7B%22showTime%22%3A1758079627363%2C%22closeTime%22%3A0%2C%22showCount%22%3A1%2C%22cursor1%22%3A23%2C%22cursor2%22%3A6%2C%22hoverTime%22%3A1758099017905%7D; IsDouyinActive=false",
      "max_cursor": 0,
      "counts": 20,
      "authorization": "bearer k41nQDpL/HcAnRcR+E6JuyE25F0pt574raxK3hbMkmVZ6HcEULtO4hGeKg=="
  }
  ```

  

* **Response:**

  ```json
  {
      "code": 1,
      "msg": "success",
      "data": [
          {
              "title": "真正能共勉的台词从不需要多冠冕堂皇#runon #奔跑着#申世景 #任时完",
              "cover": "https://p3-pc-sign.douyinpic.com/tos-cn-i-0813/o8hLzA9AEAANWID1AkAgFYXWDCf6iveztIaxKB~tplv-dy-cropcenter:323:430.jpeg?lk3s=138a59ce&x-expires=2073477600&x-signature=WgZ7E7gI%2FrtOCIgRHNbukx%2B0kkU%3D&from=327834062&s=PackSourceEnum_COLLECTION&se=true&sh=323_430&sc=cover&biz_tag=pcweb_cover&l=2025091722020757B1F7329CADF64BECD1",
              "link": "https://www.douyin.com/aweme/v1/play/?video_id=v0300fg10000cjqrpijc77uenlu49dp0&line=0&file_id=2bec409c4f2a4881b925af2222a60652&sign=f2e127ea400b54809c9899cbc2edfbd8&is_play_url=1&source=PackSourceEnum_COLLECTION"
          }
      ]
  }
  ```

  