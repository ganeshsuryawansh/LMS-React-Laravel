<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Outcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OutcomeController extends Controller
{
    // this mwthid will return all OutComes of a course
    public function index(Request $request)
    {
        $outcomes = Outcome::where('course_id', $request->course_id)->get();

        if ($outcomes == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome Not Found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $outcomes
        ], 200);
    }

    // this method will save outcome
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'outcome' => 'required',
            'course_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $outcome = new Outcome();
        $outcome->course_id = $request->course_id;
        $outcome->text = $request->outcome;
        $outcome->sort_order = 1000;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome Added Successfully!'
        ], 200);
    }

    //This method update outcome.
    public function update($id, Request $request)
    {
        $outcome = Outcome::find($id);

        if ($outcome == null) {
            return response()->json([
                'status' => 401,
                'errors' => 'Outcome Not Found!'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'outcome' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $outcome->text = $request->outcome;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome Updated Successfully!'
        ], 200);
    }

    // This method delete outcome.
    public function destroy($id)
    {
        $outcome = Outcome::find($id);

        if ($outcome == null) {
            return response()->json([
                'status' => 401,
                'message' => 'Outcome not found!'
            ], 401);
        }

        $outcome->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome Delete Successfully.!'
        ], 200);
    }
}
