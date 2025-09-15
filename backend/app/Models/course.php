<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class course extends Model
{
    protected $appends = ['course_small_image'];

    function getCourseSmallImageAttribute()
    {
        if ($this->image === "") {
            return "";
        }
        return asset('uploads/course/small/' . $this->image);
    }

    public function chapters()
    {
        return $this->hasMany(Chapter::class)->orderBy('sort_order', 'asc');
    }

    public function outcomes()
    {
        return $this->hasMany(Outcome::class)->orderBy('sort_order', 'ASC');
    }

    public function requirments()
    {
        return $this->hasMany(Requirment::class)->orderBy('sort_order', 'ASC');
    }

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function category()
    {
        return $this->belongsTo(category::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
