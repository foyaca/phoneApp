package com.abalogger;

 import com.reactnativenavigation.controllers.SplashActivity;
 import android.widget.LinearLayout;
 import android.graphics.Color;
 import android.widget.TextView;
 import android.view.Gravity;
 import android.util.TypedValue;

 public class MainActivity extends SplashActivity {
   @Override
   public LinearLayout createSplashLayout() {
     LinearLayout view = new LinearLayout(this);
     TextView textView = new TextView(this);

     view.setBackgroundColor(Color.parseColor("#4080bf"));
     view.setGravity(Gravity.CENTER);

     textView.setTextColor(Color.parseColor("#ecf2f9"));
     textView.setText("ABALogger");
     textView.setGravity(Gravity.CENTER);
     textView.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 40);

     view.addView(textView);
     return view;
   }
 }
