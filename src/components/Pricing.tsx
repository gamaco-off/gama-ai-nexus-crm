"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

// Define TypeScript interface for pricing plans
interface PricingPlan {
  id: number;
  title: string;
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    title: 'Basic Plan',
    price: 1499,
    duration: 'Yearly',
    features: [
      'Career Assessment',
      '1 Counseling Session',
      'Basic Reports',
      'Email Support',
    ],
  },
  {
    id: 2,
    title: 'Pro Plan',
    price: 2499,
    duration: 'Yearly',
    features: [
      'Career Assessment',
      '3 Counseling Sessions',
      'Detailed Reports',
      'Priority Email Support',
      'Career Guide Access',
    ],
    isPopular: true,
  },
  {
    id: 3,
    title: 'Premium Plan',
    price: 4999,
    duration: 'Yearly',
    features: [
      'Career Assessment',
      '5 Counseling Sessions',
      'Comprehensive Reports',
      'Phone & Email Support',
      'Career Guide Access',
      'Resume Building',
    ],
  },
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Main Content */}
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-lg">Find the perfect plan to guide your Lead Generation journey.</p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative ${plan.isPopular ? 'border-2 border-purple-600' : ''}`}
                >
                  {plan.isPopular && (
                    <span className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      Most Popular
                    </span>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {plan.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-3xl font-bold text-gray-800">₹{plan.price}</span>
                      <span className="text-gray-600">/{plan.duration}</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.isPopular
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
  
    </div>
  );
}

{/* <footer className="bg-gray-800 text-white py-8">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div>
      <h4 className="text-lg font-semibold mb-4">About CareerGuide</h4>
      <p className="text-gray-400">
        CareerGuide helps you find the right career path with expert counseling and resources.
      </p>
    </div>
    <div>
      <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
      <ul className="space-y-2">
        <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
        <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
      </ul>
    </div>
    <div>
      <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
      <p className="text-gray-400">Email: support@careerguide.com</p>
      <p className="text-gray-400">Phone: +91 98765 43210</p>
    </div>
  </div>
  <div className="mt-8 text-center text-gray-400">
    © {new Date().getFullYear()} CareerGuide. All rights reserved.
  </div>
</div>
</footer> */}

