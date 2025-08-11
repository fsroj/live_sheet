import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'screens/auth_screen.dart';
import '/screens/home_screen.dart';
import '/screens/lesson_editor_screen.dart';

class AppRouter {
  final GoRouter _router = GoRouter(
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const AuthScreen(),
        routes: [
          GoRoute(
            path: 'home',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: 'editor/:lessonId',
            builder: (context, state) => LessonEditorScreen(
              lessonId: state.pathParameters['lessonId'],
            ),
          ),
        ],
      ),
    ],
  );

  GoRouter get config => _router;
}