<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\category;
use App\Models\course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function fetchCategories()
    {
        $categories = category::orderBy('name', 'ASC')->where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'data' => $categories
        ], 200);
    }

    public function feturedCourses()
    {
        $courses = course::orderBy('title', 'ASC')
            ->with('level')
            ->where('is_featured', 'yes')
            ->where('status', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $courses
        ], 200);
    }

    public function courses(Request $request)
    {
        $courses = course::where('status', 1)->with('level');

        // Filter Course by keyword.
        if (!empty($request->keyword)) {
            $courses = $courses->where('title', 'like', '%' . $request->keyword . '%');
        }

        // filter course by category.
        if (!empty($request->category)) {
            $categoryArray = explode(',', $request->category);
            if (!empty($categoryArray)) {
                $courses = $courses->whereIn('category_id', $categoryArray);
            }
        }

        // filter course by level.
        if (!empty($request->level)) {
            $levelArray = explode(',', $request->level);
            if (!empty($levelArray)) {
                $courses = $courses->whereIn('level_id', $levelArray);
            }
        }

        // filter courses by language.
        if (!empty($request->language)) {
            $languageArray = explode(',', $request->language);

            if (!empty($languageArray)) {
                $courses = $courses->whereIn('language_id', $languageArray);
            }
        }

        // sort courses.
        if (!empty($request->sort)) {
            $sortArr = ['asc', 'desc'];

            if (in_array($request->sort, $sortArr)) {
                $courses = $courses->orderBy('created_at', $request->sort);
            } else {
                $courses = $courses->orderBy('created_at', 'DESC');
            }
        }

        $courses = $courses->get();

        return response()->json([
            'status' => 200,
            'data' => $courses
        ], 200);
    }

    public function fetchLevels()
    {
        $levels = Level::orderBy('created_at', 'ASC')->where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'data' => $levels
        ], 200);
    }

    public function fetchLanguages()
    {
        $languages = Language::orderBy('name', 'ASC')->where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'data' => $languages
        ], 200);
    }

    public function course($id)
    {
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
                },
                'outcomes',
                'requirments'
            ])
            ->first();

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ], 404);
        }

        $totalDuration = $course->chapters->sum('lessons_sum_duration');
        $totalLessons = $course->chapters->sum('lessons_count');

        $course->total_duration = $totalDuration;
        $course->total_lessons = $totalLessons;

        return response()->json([
            'status' => 200,
            'data' => $course
        ], 200);
    }
}
