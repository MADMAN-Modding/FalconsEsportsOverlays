// import 'package:flutter/material.dart';
// import 'package:flutter_local_notifications/flutter_local_notifications.dart';
// import 'package:windows_notification/notification_message.dart';
// import 'package:windows_notification/windows_notification.dart';

// class NotificationService {
//   static final NotificationService _notificationService =
//       NotificationService._internal();

//   factory NotificationService() {
//     return _notificationService;
//   }

//   NotificationService._internal();

//   final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
//       FlutterLocalNotificationsPlugin();
// }

// class WinNotifyPlugin {
//       // Create an instance of Windows Notification with your application name
// // application id must be null in packaged mode
// final _winNotifyPlugin = WindowsNotification(applicationId: "r"{D65231B0-B2F1-4857-A4CE-A8E7C6EA7D27}\WindowsPowerShell\v1.0\powershell.exe"");


// // create new NotificationMessage instance with id, title, body, and images
// NotificationMessage message = NotificationMessage.fromPluginTemplate(
//       "test1",
//       "TEXT",
//       "TEXT"
//       // largeImage: file_path,
//       // image: file_path
// );


// // show notification    
// WinNotifyPlugin.showNotificationPluginTemplate(message);

// }
