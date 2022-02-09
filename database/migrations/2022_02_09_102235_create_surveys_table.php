<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

class CreateSurveysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(model: User::class, column: 'user_id');
            $table->string(column: 'title', length: 1000);
            $table->string(column: 'slug', length: 1000);
            $table->tinyInteger(column: 'status');
            $table->text(column: 'description')->nullable();
            $table->timestamps();
            $table->timestamp(column: 'epire-date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('surveys');
    }
}
