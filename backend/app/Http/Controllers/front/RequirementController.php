<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Requirment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequirementController extends Controller
{
    // this method will return all OutComes of a course.
    public function index(Request $request)
    {
        $requirments = Requirment::where('course_id', $request->course_id)->get();

        if ($requirments == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome Not Found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $requirments
        ], 200);
    }

    // this method will save requirments.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'requirment' => 'required',
            'course_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $requirment = new Requirment();
        $requirment->course_id = $request->course_id;
        $requirment->text = $request->requirment;
        $requirment->sort_order = 1000;
        $requirment->save();

        return response()->json([
            'status' => 200,
            'data' => $requirment,
            'message' => 'Requirment Added Successfully!'
        ], 200);
    }

    //This method update outcome.
    public function update($id, Request $request)
    {
        $requirment = Requirment::find($id);

        if ($requirment == null) {
            return response()->json([
                'status' => 401,
                'errors' => 'Requirment Not Found!'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'requirment' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $requirment->text = $request->requirment;
        $requirment->save();

        return response()->json([
            'status' => 200,
            'data' => $requirment,
            'message' => 'Requirment Updated Successfully!'
        ], 200);
    }

    // This method delete outcome.
    public function destroy($id)
    {
        $outcome = Requirment::find($id);

        if ($outcome == null) {
            return response()->json([
                'status' => 401,
                'message' => 'Requirment not found!'
            ], 401);
        }

        $outcome->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Requirment Delete Successfully.!'
        ], 200);
    }

    // This method will sort requirments.
    public function sortRequirments(Request $request)
    {
        if (!empty($request->requirments)) {
            foreach ($request->requirments as $key => $requirment) {
                Requirment::where('id', $requirment['id'])->update(['sort_order' => $key]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order Update Successfully.!'
        ], 200);
    }
}
