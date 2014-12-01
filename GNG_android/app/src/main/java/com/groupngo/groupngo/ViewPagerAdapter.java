package com.groupngo.groupngo;

/**
 * Created by mickey on 11/16/14.
 */
import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

public class ViewPagerAdapter extends FragmentPagerAdapter {

    final int PAGE_COUNT = 2;
    // Tab Titles
    private String tabtitles[] = new String[] { "Trips", "Map" };
    Context context;

    public ViewPagerAdapter(FragmentManager fm) {
        super(fm);
    }

    @Override
    public int getCount() {
        return PAGE_COUNT;
    }

    @Override
    public Fragment getItem(int position) {
        switch (position) {

            // Open FragmentTab1.java
            case 0:
                TripFragment tripTab = new TripFragment();
                return tripTab;

            // Open FragmentTab2.java
            case 1:
                MapFragment mapTab = new MapFragment();
                mapTab.fragmentType = 1;

                return mapTab;

            // Open FragmentTab3.java
//            case 2:
//                FragmentTab3 fragmenttab3 = new FragmentTab3();
//                return fragmenttab3;
        }
        return null;
    }

    @Override
    public CharSequence getPageTitle(int position) {
        return tabtitles[position];
    }
}