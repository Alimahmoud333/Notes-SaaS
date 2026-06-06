<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('stripe_session_id')->nullable();

            $table->string('stripe_payment_intent')->nullable();

            $table->string('stripe_customer_id')->nullable();

            $table->enum('payment_status', [
                'pending',
                'paid',
                'cancelled',
                'failed'
            ])->default('pending');

            $table->decimal('amount', 10, 2);

            $table->string('currency')
                ->default('usd');

            $table->string('plan');

            $table->timestamp('starts_at')->nullable();

            $table->timestamp('ends_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};