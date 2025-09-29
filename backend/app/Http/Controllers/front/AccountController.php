<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:5',
            'email' => 'required|email|unique:users',
            'password' => 'required',
        ]);

        // Error Handling
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // Save Data Into DB
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => "User Register Successfully!"
        ], 200);
    }

    public function authenticate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Error Handling
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = User::find(Auth::user()->id);
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'name' => $user->name,
                'id' => $user->id,
            ], 200);
        } else {
            return response()->json([
                'status' => 401,
                'errors' => 'Invalid Credentials'
            ], 401);
        }
    }

    public function courses(Request $request)
    {
        $courses = course::where('user_id', $request->user()->id)
            ->with('level')
            ->get();

        return response()->json([
            'status' => 200,
            'courses' => $courses
        ], 200);
    }

    public function enrollments(Request $request)
    {
        $enrollments = Enrollment::where('user_id', $request->user()->id)
            ->with('course', 'course.level')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $enrollments
        ], 200);
    }

    public function course($id, Request $request)
    {
        $count = Enrollment::where(['user_id' => $request->user()->id, 'course_id' => $id])->count();

        if ($count == 0) {
            return response()->json([
                'status' => 404,
                'message' => 'You Can Not Access This Course!'
            ], 404);
        }

        $course = course::where('id', $id)
            ->withCount('chapters')
            ->with([
                'category',
                'level',
                'language',
                'chapters' => function ($query) {
                    $query->withCount(['lessons' => function ($q) {
                        $q->where('status', 1)->whereNotNull('video');
                    }]);
                    $query->withSum('lessons as lessons_sum_duration', 'duration');
                },
                'chapters.lessons' => function ($q) {
                    $q->where('status', 1);
                    $q->whereNotNull('video');
                }
            ])
            ->first();

        return response()->json([
            'status' => 200,
            'data' => $course
        ], 200);
    }
}
