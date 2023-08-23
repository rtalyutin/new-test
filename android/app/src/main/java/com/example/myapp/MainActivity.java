```java
package com.example.myapp;

import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Call the method to get the OpenAI account balance
        getOpenAIAccountBalance();
    }

    private void getOpenAIAccountBalance() {
        // Make API call to get the OpenAI account balance
        // Replace "YOUR_API_KEY" with your actual API key
        String apiKey = "YOUR_API_KEY";
        OpenAI openAI = new OpenAI(apiKey);
        double accountBalance = openAI.getAccountBalance();

        // Log the account balance
        Log.d(TAG, "OpenAI Account Balance: " + accountBalance);
    }
}
```
