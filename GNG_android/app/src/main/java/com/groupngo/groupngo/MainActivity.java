package com.groupngo.groupngo;

import android.app.ActionBar;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.FragmentTransaction;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.view.ViewPager;
import android.support.v4.widget.SwipeRefreshLayout;
import android.text.Layout;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.widget.EditText;

import com.groupngo.groupngo.dataService.DataService;

import java.util.logging.Handler;
import java.util.zip.Inflater;


public class MainActivity extends FragmentActivity implements TripFragment.OnFragmentInteractionListener, MapFragment.OnFragmentInteractionListener{

    private ViewPager viewPager;
    private String cuc;
//    public static FragmentManager fragmentManager;
    public SharedPreferences authenticationData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Locate the viewpager in activity_main.xml
        viewPager = (ViewPager) findViewById(R.id.pager);

        // Set the ViewPagerAdapter into ViewPager
        viewPager.setAdapter(new ViewPagerAdapter(getSupportFragmentManager()));
//        fragmentManager = getSupportFragmentManager();

        authenticationData = this.getSharedPreferences("com.groupngo.groupngo", Context.MODE_PRIVATE);

        if (authenticationData.getString("cuc", null) != null) {
            cuc = authenticationData.getString("cuc", null);
//            Log.d("cuc in main", authenticationData.getString("cuc", null));
        }
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu items for use in the action bar
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_main, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle presses on the action bar items
        switch (item.getItemId()) {
            case R.id.action_search:
                openSearch();
                return true;
            case R.id.action_post:
                openPost();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    // open search dialog
    private void openSearch() {
        Log.d("Search Dialog", "Opening Dialog");
        final AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
        LayoutInflater inflater = MainActivity.this.getLayoutInflater();

        builder.setView(inflater.inflate(R.layout.dialog_search, null))
                .setPositiveButton(R.string.search, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //Search nearby trips
                        Dialog f = (Dialog) dialog;
                        EditText slocation = (EditText)f.findViewById(R.id.search_input);
//                        Log.d("post", slocation.getText().toString() + ", " + elocation.getText().toString());
                        new DataService.searchTrips(new OnTaskCompleted() {
                            @Override
                            public void onTaskCompleted() {
                                TripFragment.refreshArray();
                            }
                        }, cuc, slocation.getText().toString());
                    }
                })
                .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //Cancel

                    }
                });
        builder.show();
    };

    // open post dialog
    private void openPost() {
        Log.d("Post Dialog", "Opening Dialog");
        final AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
        LayoutInflater inflater = MainActivity.this.getLayoutInflater();

        builder.setView(inflater.inflate(R.layout.dialog_post, null))
                .setPositiveButton(R.string.post, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //Search nearby trips
                        Dialog f = (Dialog) dialog;
                        EditText slocation = (EditText)f.findViewById(R.id.post_s_input);
                        EditText elocation = (EditText)f.findViewById(R.id.post_e_input);
//                        Log.d("post", slocation.getText().toString() + ", " + elocation.getText().toString());
                        new DataService.postTrip(cuc, slocation.getText().toString(), elocation.getText().toString());
                    }
                })
                .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        //Cancel

                    }
                });
        builder.show();
    };

    //get trip detail
    @Override
    public void onFragmentInteraction(String id) {
        final String trip_id = id;
        Log.d("selected trip", id);
        new DataService.getTripDetail(new OnTaskCompleted() {
            @Override
            public void onTaskCompleted() {
                final AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
                LayoutInflater inflater = MainActivity.this.getLayoutInflater();
                CharSequence[] cs = DataService.TRIPMEMBERS.toArray(new CharSequence[DataService.TRIPMEMBERS.size()]);
                builder.setTitle(R.string.trip_detail_title)
                        .setItems(cs, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {

                            }
                        })
                        .setPositiveButton(R.string.join_leave, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                new DataService.joinTrip(new OnTaskCompleted() {
                                    @Override
                                    public void onTaskCompleted() {

                                    }
                                }, cuc, trip_id);
                            }
                        })
                        .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {

                            }
                        });
                builder.show();
            }
        }, cuc, trip_id);
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }
}
