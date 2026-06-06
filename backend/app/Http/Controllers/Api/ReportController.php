<?php

namespace App\Http\Controllers\Api;

use App\Models\Note;
use App\Models\Report;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    /*
    =========================================
    CREATE REPORT
    =========================================
    */

    public function store(Request $request)
    {
        $request->validate([
            'note_id' => 'required|exists:notes,id',
            'reason' => 'required|string|min:5|max:1000',
        ]);

        $note = Note::findOrFail(
            $request->note_id
        );

        if ($note->user_id == $request->user()->id) {
            return response()->json([
                'message' => 'You cannot report your own note'
            ], 422);
        }

        $alreadyReported = Report::where(
            'user_id',
            $request->user()->id
        )
        ->where(
            'note_id',
            $request->note_id
        )
        ->exists();

        if ($alreadyReported) {
            return response()->json([
                'message' => 'You already reported this note'
            ], 422);
        }

        $report = Report::create([
            'user_id' => $request->user()->id,
            'note_id' => $request->note_id,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Report submitted successfully',
            'report' => $report
        ], 201);
    }

    /*
    =========================================
    MY REPORTS
    =========================================
    */

public function myReports(Request $request)
{
    $reports = Report::with(['note.user'])
        ->where('user_id', $request->user()->id)
        ->latest()
        ->paginate(10);

    return response()->json($reports);
}

}